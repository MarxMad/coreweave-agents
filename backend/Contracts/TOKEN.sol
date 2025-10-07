// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PumaToken - Token inteligente con gestión de agentes AI
 * @dev Contrato ERC20 mejorado con funcionalidades para agentes AI
 * @notice El supply inicial se ingresa sin decimales (ej: 1000000 para 1M tokens)
 */
contract PumaToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    
    // ============ STRUCTS ============
    
    struct AIAgentConfig {
        bool communityManager;
        bool marketingAI;
        bool dataAnalyst;
        bool tradingAssistant;
    }
    
    struct TokenInfo {
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 decimals;
        uint256 launchTimestamp;
        uint256 lastConfigurationTime;
    }
    
    struct AgentInfo {
        bool isAuthorized;
        bool isProposed;
        uint256 authorizationTime;
        uint256 lastActivityTime;
        uint256 tokenAllowance;
    }
    
    // ============ STATE VARIABLES ============
    
    AIAgentConfig public aiAgents;
    uint256 public launchTimestamp;
    uint256 public lastConfigurationTime;
    uint256 public constant CONFIG_COOLDOWN = 7 days;
    uint256 public constant AGENT_CONFIRMATION_DELAY = 1 days;
    
    // Mappings para gestión de agentes
    mapping(address => AgentInfo) public agentRegistry;
    mapping(address => bool) public authorizedAgents;
    mapping(address => bool) public proposedAgents;
    
    // Control de límites
    uint256 public maxAgentAllowance;
    uint256 public constant MAX_AGENT_ALLOWANCE = 1000000 * 10**18; // 1M tokens máximo por agente
    
    // ============ EVENTS ============
    
    event AIAgentsConfigured(
        bool communityManager,
        bool marketingAI,
        bool dataAnalyst,
        bool tradingAssistant,
        uint256 timestamp
    );
    
    event AgentProposed(address indexed agent, uint256 timestamp);
    event AgentConfirmed(address indexed agent, uint256 timestamp);
    event AgentRevoked(address indexed agent, uint256 timestamp);
    
    event AgentTokensSpent(
        address indexed agent,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );
    
    event AgentAllowanceUpdated(
        address indexed agent,
        uint256 oldAllowance,
        uint256 newAllowance
    );
    
    event EmergencyPaused(address indexed pauser, uint256 timestamp);
    event EmergencyUnpaused(address indexed unpauser, uint256 timestamp);
    
    // ============ MODIFIERS ============
    
    modifier onlyAuthorizedAgent() {
        require(authorizedAgents[msg.sender], "Caller is not an authorized agent");
        require(!paused(), "Contract is paused");
        _;
    }
    
    modifier onlyProposedAgent() {
        require(proposedAgents[msg.sender], "Agent not proposed");
        _;
    }
    
    modifier cooldownActive() {
        require(
            block.timestamp >= lastConfigurationTime + CONFIG_COOLDOWN,
            "Configuration cooldown active"
        );
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    /**
     * @dev Constructor del token
     * @param _name Nombre del token
     * @param _symbol Símbolo del token
     * @param _initialSupply Supply inicial sin decimales (ej: 1000000 para 1M tokens)
     * @param _initialOwner Propietario inicial del contrato
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _initialOwner
    ) ERC20(_name, _symbol) Ownable(_initialOwner) {
        require(_initialSupply > 0, "Initial supply must be greater than 0");
        require(_initialOwner != address(0), "Initial owner cannot be zero address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_symbol).length > 0, "Symbol cannot be empty");
        
        // El supply se ingresa sin decimales, el contrato maneja los decimales internamente
        _mint(_initialOwner, _initialSupply * 10 ** decimals());
        launchTimestamp = block.timestamp;
        lastConfigurationTime = block.timestamp;
        maxAgentAllowance = MAX_AGENT_ALLOWANCE;
    }
    
    // ============ AI AGENTS MANAGEMENT ============
    
    /**
     * @dev Configura los agentes AI con cooldown de seguridad
     * @param _communityManager Habilita agente de gestión de comunidad
     * @param _marketingAI Habilita agente de marketing AI
     * @param _dataAnalyst Habilita agente analista de datos
     * @param _tradingAssistant Habilita agente asistente de trading
     */
    function configureAIAgents(
        bool _communityManager,
        bool _marketingAI,
        bool _dataAnalyst,
        bool _tradingAssistant
    ) external onlyOwner cooldownActive {
        lastConfigurationTime = block.timestamp;
        
        aiAgents = AIAgentConfig({
            communityManager: _communityManager,
            marketingAI: _marketingAI,
            dataAnalyst: _dataAnalyst,
            tradingAssistant: _tradingAssistant
        });
        
        emit AIAgentsConfigured(
            _communityManager,
            _marketingAI,
            _dataAnalyst,
            _tradingAssistant,
            block.timestamp
        );
    }
    
    /**
     * @dev Propone un nuevo agente (primer paso del proceso de 2 pasos)
     * @param agent Dirección del agente a proponer
     */
    function proposeAgent(address agent) external onlyOwner {
        require(agent != address(0), "Agent cannot be zero address");
        require(!authorizedAgents[agent], "Agent already authorized");
        require(!proposedAgents[agent], "Agent already proposed");
        
        proposedAgents[agent] = true;
        agentRegistry[agent].isProposed = true;
        agentRegistry[agent].authorizationTime = block.timestamp;
        
        emit AgentProposed(agent, block.timestamp);
    }
    
    /**
     * @dev Confirma un agente propuesto después del delay de seguridad
     * @param agent Dirección del agente a confirmar
     */
    function confirmAgent(address agent) external onlyOwner {
        require(proposedAgents[agent], "Agent not proposed");
        require(
            block.timestamp >= agentRegistry[agent].authorizationTime + AGENT_CONFIRMATION_DELAY,
            "Confirmation delay not met"
        );
        
        authorizedAgents[agent] = true;
        agentRegistry[agent].isAuthorized = true;
        agentRegistry[agent].isProposed = false;
        agentRegistry[agent].lastActivityTime = block.timestamp;
        
        delete proposedAgents[agent];
        
        emit AgentConfirmed(agent, block.timestamp);
    }
    
    /**
     * @dev Revoca la autorización de un agente
     * @param agent Dirección del agente a revocar
     */
    function revokeAgent(address agent) external onlyOwner {
        require(agent != address(0), "Agent cannot be zero address");
        require(authorizedAgents[agent], "Agent not authorized");
        
        authorizedAgents[agent] = false;
        agentRegistry[agent].isAuthorized = false;
        agentRegistry[agent].tokenAllowance = 0;
        
        emit AgentRevoked(agent, block.timestamp);
    }
    
    /**
     * @dev Establece el allowance de tokens para un agente
     * @param agent Dirección del agente
     * @param allowance Cantidad de tokens permitidos
     */
    function setAgentAllowance(address agent, uint256 allowance) external onlyOwner {
        require(authorizedAgents[agent], "Agent not authorized");
        require(allowance <= maxAgentAllowance, "Allowance exceeds maximum");
        
        uint256 oldAllowance = agentRegistry[agent].tokenAllowance;
        agentRegistry[agent].tokenAllowance = allowance;
        
        emit AgentAllowanceUpdated(agent, oldAllowance, allowance);
    }
    
    // ============ AGENT OPERATIONS ============
    
    /**
     * @dev Permite a un agente autorizado gastar tokens
     * @param recipient Destinatario de los tokens
     * @param amount Cantidad de tokens a gastar
     */
    function agentSpendTokens(
        address recipient,
        uint256 amount
    ) external onlyAuthorizedAgent nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(
            amount <= agentRegistry[msg.sender].tokenAllowance,
            "Amount exceeds agent allowance"
        );
        require(
            balanceOf(address(this)) >= amount,
            "Insufficient contract balance"
        );
        
        // Actualizar allowance y actividad del agente
        agentRegistry[msg.sender].tokenAllowance -= amount;
        agentRegistry[msg.sender].lastActivityTime = block.timestamp;
        
        // Transferir tokens
        _transfer(address(this), recipient, amount);
        
        emit AgentTokensSpent(msg.sender, recipient, amount, block.timestamp);
    }
    
    /**
     * @dev Permite a un agente autorizado transferir tokens desde su balance
     * @param recipient Destinatario de los tokens
     * @param amount Cantidad de tokens a transferir
     */
    function agentTransferTokens(
        address recipient,
        uint256 amount
    ) external onlyAuthorizedAgent nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(
            balanceOf(msg.sender) >= amount,
            "Insufficient agent balance"
        );
        
        // Actualizar actividad del agente
        agentRegistry[msg.sender].lastActivityTime = block.timestamp;
        
        // Transferir tokens
        _transfer(msg.sender, recipient, amount);
    }
    
    // ============ EMERGENCY FUNCTIONS ============
    
    /**
     * @dev Pausa el contrato en caso de emergencia
     */
    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Despausa el contrato
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
        emit EmergencyUnpaused(msg.sender, block.timestamp);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Obtiene la configuración de agentes AI
     * @return Configuración actual de agentes
     */
    function getAIAgentsConfig() external view returns (AIAgentConfig memory) {
        return aiAgents;
    }
    
    /**
     * @dev Verifica si un agente está autorizado
     * @param agent Dirección del agente
     * @return true si está autorizado
     */
    function isAgentAuthorized(address agent) external view returns (bool) {
        return authorizedAgents[agent];
    }
    
    /**
     * @dev Obtiene información completa del token
     * @return Información del token en un struct
     */
    function getTokenInfo() external view returns (TokenInfo memory) {
        return TokenInfo({
            name: name(),
            symbol: symbol(),
            totalSupply: totalSupply(),
            decimals: decimals(),
            launchTimestamp: launchTimestamp,
            lastConfigurationTime: lastConfigurationTime
        });
    }
    
    /**
     * @dev Obtiene información de un agente específico
     * @param agent Dirección del agente
     * @return Información del agente
     */
    function getAgentInfo(address agent) external view returns (AgentInfo memory) {
        return agentRegistry[agent];
    }
    
    /**
     * @dev Obtiene el tiempo restante del cooldown de configuración
     * @return Tiempo restante en segundos
     */
    function getConfigCooldownRemaining() external view returns (uint256) {
        if (block.timestamp >= lastConfigurationTime + CONFIG_COOLDOWN) {
            return 0;
        }
        return (lastConfigurationTime + CONFIG_COOLDOWN) - block.timestamp;
    }
    
    /**
     * @dev Obtiene el tiempo restante para confirmar un agente propuesto
     * @param agent Dirección del agente
     * @return Tiempo restante en segundos
     */
    function getAgentConfirmationRemaining(address agent) external view returns (uint256) {
        if (!proposedAgents[agent]) {
            return 0;
        }
        
        uint256 confirmationTime = agentRegistry[agent].authorizationTime + AGENT_CONFIRMATION_DELAY;
        if (block.timestamp >= confirmationTime) {
            return 0;
        }
        return confirmationTime - block.timestamp;
    }
    
    // ============ OVERRIDE FUNCTIONS ============
    
    /**
     * @dev Override de transfer para incluir pausa
     */
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Override de transferFrom para incluir pausa
     */
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Override de approve para incluir pausa
     */
    function approve(address spender, uint256 amount) public override whenNotPaused returns (bool) {
        return super.approve(spender, amount);
    }
    
    /**
     * @dev Override de increaseAllowance para incluir pausa
     */
    function increaseAllowance(address spender, uint256 addedValue) public override whenNotPaused returns (bool) {
        return super.increaseAllowance(spender, addedValue);
    }
    
    /**
     * @dev Override de decreaseAllowance para incluir pausa
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public override whenNotPaused returns (bool) {
        return super.decreaseAllowance(spender, subtractedValue);
    }
}