import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { useCoreWeaveTokenFactory } from '@/hooks/use-core-weave-token-factory';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: string;
}

export const ContractDiagnostics: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { creationFee } = useCoreWeaveTokenFactory();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Verificar si el contrato existe
  const { data: contractOwner, error: contractError } = useReadContract({
    address: CONTRACT_ADDRESSES.CORE_WEAVE_TOKEN_FACTORY,
    abi: [{
      name: 'owner',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'address' }]
    }],
    functionName: 'owner',
  });

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // 1. Verificar conexión de wallet
    results.push({
      name: 'Wallet Connection',
      status: isConnected ? 'success' : 'error',
      message: isConnected ? 'Wallet conectado correctamente' : 'Wallet no conectado',
      details: address ? `Dirección: ${address}` : undefined
    });

    // 2. Verificar red CoreDAO
    const isCoreDaoChain = chain?.id === 1116;
    results.push({
      name: 'CoreDAO Network',
      status: isCoreDaoChain ? 'success' : 'error',
      message: isCoreDaoChain ? 'Conectado a CoreDAO' : `Conectado a ${chain?.name || 'red desconocida'}`,
      details: `Chain ID: ${chain?.id || 'N/A'}`
    });

    // 3. Verificar balance CORE
    if (balance) {
      const balanceNum = parseFloat(balance.formatted);
      const hasEnoughBalance = balanceNum >= 0.05;
      results.push({
        name: 'CORE Balance',
        status: hasEnoughBalance ? 'success' : balanceNum > 0 ? 'warning' : 'error',
        message: `${balance.formatted} ${balance.symbol}`,
        details: hasEnoughBalance ? 'Suficiente para crear tokens' : 'Balance insuficiente (mínimo 0.05 CORE)'
      });
    } else {
      results.push({
        name: 'CORE Balance',
        status: 'error',
        message: 'No se pudo obtener el balance',
        details: 'Verifica la conexión de red'
      });
    }

    // 4. Verificar contrato desplegado
    if (contractError) {
      results.push({
        name: 'Contract Deployment',
        status: 'error',
        message: 'Error al verificar contrato',
        details: contractError.message
      });
    } else if (contractOwner) {
      results.push({
        name: 'Contract Deployment',
        status: 'success',
        message: 'Contrato desplegado correctamente',
        details: `Owner: ${contractOwner}`
      });
    } else {
      results.push({
        name: 'Contract Deployment',
        status: 'loading',
        message: 'Verificando contrato...',
      });
    }

    // 5. Verificar creation fee
    if (creationFee) {
      results.push({
        name: 'Creation Fee',
        status: 'success',
        message: `${creationFee} CORE`,
        details: 'Fee de creación obtenido correctamente'
      });
    } else {
      results.push({
        name: 'Creation Fee',
        status: 'warning',
        message: 'No se pudo obtener el fee',
        details: 'Puede afectar la creación de tokens'
      });
    }

    // 6. Verificar conectividad RPC
    try {
      const response = await fetch('https://rpc.coredao.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          name: 'RPC Connectivity',
          status: 'success',
          message: 'Conexión RPC exitosa',
          details: `Último bloque: ${parseInt(data.result, 16)}`
        });
      } else {
        results.push({
          name: 'RPC Connectivity',
          status: 'error',
          message: 'Error de conexión RPC',
          details: `HTTP ${response.status}`
        });
      }
    } catch (error) {
      results.push({
        name: 'RPC Connectivity',
        status: 'error',
        message: 'Error de red',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isConnected) {
      runDiagnostics();
    }
  }, [isConnected, chain?.id, balance, contractOwner, creationFee]);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      loading: 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const hasErrors = diagnostics.some(d => d.status === 'error');
  const hasWarnings = diagnostics.some(d => d.status === 'warning');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Contract Diagnostics
            {hasErrors && <XCircle className="h-5 w-5 text-red-500" />}
            {!hasErrors && hasWarnings && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
            {!hasErrors && !hasWarnings && diagnostics.length > 0 && <CheckCircle className="h-5 w-5 text-green-500" />}
          </CardTitle>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            {isRunning ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Running...</>
            ) : (
              'Run Diagnostics'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Conecta tu wallet para ejecutar diagnósticos completos.
            </AlertDescription>
          </Alert>
        )}

        {diagnostics.length > 0 && (
          <div className="space-y-3">
            {diagnostics.map((diagnostic, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{diagnostic.name}</span>
                    {getStatusBadge(diagnostic.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{diagnostic.message}</p>
                  {diagnostic.details && (
                    <p className="text-xs text-muted-foreground mt-1">{diagnostic.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasErrors && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Se detectaron errores críticos. Revisa los elementos marcados en rojo antes de intentar crear un token.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Contract Address:</span>
            <code className="bg-muted px-2 py-1 rounded text-xs">
              {CONTRACT_ADDRESSES.CORE_WEAVE_TOKEN_FACTORY}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => window.open(`https://scan.coredao.org/address/${CONTRACT_ADDRESSES.CORE_WEAVE_TOKEN_FACTORY}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};