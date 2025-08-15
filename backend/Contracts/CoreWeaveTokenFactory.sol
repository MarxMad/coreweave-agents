// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CoreWeaveToken.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoreWeaveTokenFactory is ReentrancyGuard, Ownable {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 totalSupply;
        address creator;
        uint256 createdAt;
        bool hasAIAgents;
        uint256 creationFee;
    }
    
    mapping(address => TokenInfo[]) public userTokens;
    mapping(address => TokenInfo) public tokenDetails;
    TokenInfo[] public allTokens;
    
    uint256 public creationFee = 0.01 ether; // Fee en CORE
    address public feeRecipient;
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply
    );
    
    constructor() Ownable(msg.sender) {
        feeRecipient = msg.sender;
    }
    
    function createToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        bool enableAIAgents
    ) external payable nonReentrant returns (address) {
        require(msg.value >= creationFee, "Insufficient fee");
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length > 0, "Symbol required");
        require(totalSupply > 0, "Supply must be > 0");
        
        // Crear nuevo token
        CoreWeaveToken newToken = new CoreWeaveToken(
            name,
            symbol,
            totalSupply,
            msg.sender
        );
        
        // Configurar AI si está habilitado
        if (enableAIAgents) {
            newToken.configureAIAgents(true, true, true, true);
        }
        
        // Registrar información
        TokenInfo memory tokenInfo = TokenInfo({
            tokenAddress: address(newToken),
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            creator: msg.sender,
            createdAt: block.timestamp,
            hasAIAgents: enableAIAgents,
            creationFee: msg.value
        });
        
        userTokens[msg.sender].push(tokenInfo);
        tokenDetails[address(newToken)] = tokenInfo;
        allTokens.push(tokenInfo);
        
        // Transferir fee
        payable(feeRecipient).transfer(msg.value);
        
        emit TokenCreated(address(newToken), msg.sender, name, symbol, totalSupply);
        return address(newToken);
    }
    
    function getUserTokens(address user) external view returns (TokenInfo[] memory) {
        return userTokens[user];
    }
    
    function getAllTokens() external view returns (TokenInfo[] memory) {
        return allTokens;
    }
    
    function setCreationFee(uint256 _fee) external onlyOwner {
        creationFee = _fee;
    }
    
    function setFeeRecipient(address _recipient) external onlyOwner {
        feeRecipient = _recipient;
    }
}