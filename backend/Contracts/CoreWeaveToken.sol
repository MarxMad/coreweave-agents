// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CoreWeaveToken is ERC20, Ownable, ReentrancyGuard {
    struct AIAgentConfig {
        bool communityManager;
        bool marketingAI;
        bool dataAnalyst;
        bool tradingAssistant;
    }
    
    AIAgentConfig public aiAgents;
    uint256 public launchTimestamp;
    mapping(address => bool) public authorizedAgents;
    
    // Events
    event AIAgentsConfigured(
        bool communityManager,
        bool marketingAI,
        bool dataAnalyst,
        bool tradingAssistant
    );
    event AgentAuthorized(address indexed agent);
    event AgentRevoked(address indexed agent);
    
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
        
        _mint(_initialOwner, _initialSupply * 10 ** decimals());
        launchTimestamp = block.timestamp;
    }
    
    function configureAIAgents(
        bool _communityManager,
        bool _marketingAI,
        bool _dataAnalyst,
        bool _tradingAssistant
    ) external onlyOwner {
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
            _tradingAssistant
        );
    }
    
    function authorizeAgent(address agent) external onlyOwner {
        require(agent != address(0), "Agent cannot be zero address");
        require(!authorizedAgents[agent], "Agent already authorized");
        
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent);
    }
    
    function revokeAgent(address agent) external onlyOwner {
        require(agent != address(0), "Agent cannot be zero address");
        require(authorizedAgents[agent], "Agent not authorized");
        
        authorizedAgents[agent] = false;
        emit AgentRevoked(agent);
    }
    
    // View functions
    function getAIAgentsConfig() external view returns (AIAgentConfig memory) {
        return aiAgents;
    }
    
    function isAgentAuthorized(address agent) external view returns (bool) {
        return authorizedAgents[agent];
    }
    
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint256 tokenTotalSupply,
        uint256 tokenDecimals,
        uint256 tokenLaunchTimestamp
    ) {
        return (
            name(),
            symbol(),
            totalSupply(),
            decimals(),
            launchTimestamp
        );
    }
}