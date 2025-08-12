// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AIAgentManager is Ownable, ReentrancyGuard {
    struct Agent {
        bytes32 agentId;
        string agentType; // "community", "marketing", "data", "trading"
        address tokenContract;
        address owner;
        bool isActive;
        uint256 budget;
        string configuration;
        uint256 createdAt;
        uint256 lastActivity;
    }
    
    mapping(address => Agent[]) public tokenAgents;
    mapping(bytes32 => Agent) public agents;
    mapping(address => bool) public authorizedTokens;
    
    event AgentCreated(
        bytes32 indexed agentId,
        address indexed tokenContract,
        address indexed owner,
        string agentType
    );
    
    event AgentActivated(bytes32 indexed agentId);
    event AgentDeactivated(bytes32 indexed agentId);
    
    constructor() Ownable(msg.sender) {}
    
    function createAgent(
        address tokenContract,
        string memory agentType,
        uint256 budget,
        string memory configuration
    ) external nonReentrant returns (bytes32) {
        require(authorizedTokens[tokenContract], "Token not authorized");
        
        bytes32 agentId = keccak256(
            abi.encodePacked(
                tokenContract, 
                agentType, 
                msg.sender, 
                block.timestamp
            )
        );
        
        Agent memory newAgent = Agent({
            agentId: agentId,
            agentType: agentType,
            tokenContract: tokenContract,
            owner: msg.sender,
            isActive: true,
            budget: budget,
            configuration: configuration,
            createdAt: block.timestamp,
            lastActivity: block.timestamp
        });
        
        agents[agentId] = newAgent;
        tokenAgents[tokenContract].push(newAgent);
        
        emit AgentCreated(agentId, tokenContract, msg.sender, agentType);
        return agentId;
    }
    
    function authorizeToken(address tokenContract) external onlyOwner {
        authorizedTokens[tokenContract] = true;
    }
    
    function toggleAgent(bytes32 agentId) external {
        Agent storage agent = agents[agentId];
        require(agent.owner == msg.sender, "Not agent owner");
        
        agent.isActive = !agent.isActive;
        agent.lastActivity = block.timestamp;
        
        if (agent.isActive) {
            emit AgentActivated(agentId);
        } else {
            emit AgentDeactivated(agentId);
        }
    }
    
    function getTokenAgents(address tokenContract) external view returns (Agent[] memory) {
        return tokenAgents[tokenContract];
    }
}