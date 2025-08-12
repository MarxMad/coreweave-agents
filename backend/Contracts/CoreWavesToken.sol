// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoreWeaveToken is ERC20, Ownable {
    struct AIAgentConfig {
        bool communityManager;
        bool marketingAI;
        bool dataAnalyst;
        bool tradingAssistant;
    }
    
    AIAgentConfig public aiAgents;
    uint256 public launchTimestamp;
    mapping(address => bool) public authorizedAgents;
    
    constructor(
        address initialOwner,
        uint256 initialSupply,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _transferOwnership(initialOwner);
        _mint(initialOwner, initialSupply * 10 ** 18);
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
    }
    
    function authorizeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = true;
    }
    
    function revokeAgent(address agent) external onlyOwner {
        authorizedAgents[agent] = false;
    }
}