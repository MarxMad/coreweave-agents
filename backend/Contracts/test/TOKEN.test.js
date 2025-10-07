const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PumaToken", function () {
  let PumaToken;
  let pumaToken;
  let owner;
  let agent1;
  let agent2;
  let user1;
  let user2;

  const TOKEN_NAME = "Puma Token";
  const TOKEN_SYMBOL = "PUMA";
  const INITIAL_SUPPLY = 1000000; // 1M tokens (sin decimales)
  const INITIAL_SUPPLY_WITH_DECIMALS = ethers.parseUnits("1000000", 18);

  beforeEach(async function () {
    [owner, agent1, agent2, user1, user2] = await ethers.getSigners();

    PumaToken = await ethers.getContractFactory("PumaToken");
    pumaToken = await PumaToken.deploy(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      INITIAL_SUPPLY,
      owner.address
    );
    await pumaToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await pumaToken.owner()).to.equal(owner.address);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await pumaToken.name()).to.equal(TOKEN_NAME);
      expect(await pumaToken.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should mint the correct initial supply", async function () {
      expect(await pumaToken.totalSupply()).to.equal(INITIAL_SUPPLY_WITH_DECIMALS);
      expect(await pumaToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY_WITH_DECIMALS);
    });

    it("Should set the launch timestamp", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      expect(await pumaToken.launchTimestamp()).to.equal(block.timestamp);
    });

    it("Should set the last configuration time", async function () {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      expect(await pumaToken.lastConfigurationTime()).to.equal(block.timestamp);
    });
  });

  describe("AI Agents Configuration", function () {
    it("Should configure AI agents correctly", async function () {
      const config = {
        communityManager: true,
        marketingAI: false,
        dataAnalyst: true,
        tradingAssistant: false
      };

      await pumaToken.configureAIAgents(
        config.communityManager,
        config.marketingAI,
        config.dataAnalyst,
        config.tradingAssistant
      );

      const aiConfig = await pumaToken.getAIAgentsConfig();
      expect(aiConfig.communityManager).to.equal(config.communityManager);
      expect(aiConfig.marketingAI).to.equal(config.marketingAI);
      expect(aiConfig.dataAnalyst).to.equal(config.dataAnalyst);
      expect(aiConfig.tradingAssistant).to.equal(config.tradingAssistant);
    });

    it("Should enforce cooldown between configurations", async function () {
      const config = {
        communityManager: true,
        marketingAI: true,
        dataAnalyst: true,
        tradingAssistant: true
      };

      await pumaToken.configureAIAgents(
        config.communityManager,
        config.marketingAI,
        config.dataAnalyst,
        config.tradingAssistant
      );

      // Intentar configurar de nuevo inmediatamente debería fallar
      await expect(
        pumaToken.configureAIAgents(
          false, false, false, false
        )
      ).to.be.revertedWith("Configuration cooldown active");
    });

    it("Should update last configuration time", async function () {
      const initialTime = await pumaToken.lastConfigurationTime();
      
      await pumaToken.configureAIAgents(true, true, true, true);
      
      const newTime = await pumaToken.lastConfigurationTime();
      expect(newTime).to.be.gt(initialTime);
    });
  });

  describe("Agent Management", function () {
    it("Should propose an agent", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      expect(await pumaToken.proposedAgents(agent1.address)).to.be.true;
      expect(await pumaToken.isAgentAuthorized(agent1.address)).to.be.false;
    });

    it("Should not allow proposing already proposed agent", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      await expect(
        pumaToken.proposeAgent(agent1.address)
      ).to.be.revertedWith("Agent already proposed");
    });

    it("Should not allow proposing already authorized agent", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      // Avanzar tiempo para confirmar
      await ethers.provider.send("evm_increaseTime", [86400]); // 1 día
      await ethers.provider.send("evm_mine");
      
      await pumaToken.confirmAgent(agent1.address);
      
      await expect(
        pumaToken.proposeAgent(agent1.address)
      ).to.be.revertedWith("Agent already authorized");
    });

    it("Should confirm agent after delay", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      // Avanzar tiempo para confirmar
      await ethers.provider.send("evm_increaseTime", [86400]); // 1 día
      await ethers.provider.send("evm_mine");
      
      await pumaToken.confirmAgent(agent1.address);
      
      expect(await pumaToken.authorizedAgents(agent1.address)).to.be.true;
      expect(await pumaToken.proposedAgents(agent1.address)).to.be.false;
    });

    it("Should not allow confirming agent before delay", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      // Intentar confirmar inmediatamente debería fallar
      await expect(
        pumaToken.confirmAgent(agent1.address)
      ).to.be.revertedWith("Confirmation delay not met");
    });

    it("Should revoke agent", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine");
      
      await pumaToken.confirmAgent(agent1.address);
      await pumaToken.revokeAgent(agent1.address);
      
      expect(await pumaToken.authorizedAgents(agent1.address)).to.be.false;
    });
  });

  describe("Agent Allowance", function () {
    beforeEach(async function () {
      await pumaToken.proposeAgent(agent1.address);
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine");
      await pumaToken.confirmAgent(agent1.address);
    });

    it("Should set agent allowance", async function () {
      const allowance = ethers.parseEther("1000");
      await pumaToken.setAgentAllowance(agent1.address, allowance);
      
      const agentInfo = await pumaToken.getAgentInfo(agent1.address);
      expect(agentInfo.tokenAllowance).to.equal(allowance);
    });

    it("Should not allow setting allowance above maximum", async function () {
      const maxAllowance = await pumaToken.maxAgentAllowance();
      const excessiveAllowance = maxAllowance + ethers.parseEther("1");
      
      await expect(
        pumaToken.setAgentAllowance(agent1.address, excessiveAllowance)
      ).to.be.revertedWith("Allowance exceeds maximum");
    });

    it("Should emit allowance updated event", async function () {
      const allowance = ethers.parseEther("1000");
      
      await expect(pumaToken.setAgentAllowance(agent1.address, allowance))
        .to.emit(pumaToken, "AgentAllowanceUpdated")
        .withArgs(agent1.address, 0, allowance);
    });
  });

  describe("Agent Operations", function () {
    beforeEach(async function () {
      await pumaToken.proposeAgent(agent1.address);
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine");
      await pumaToken.confirmAgent(agent1.address);
      
      // Transferir tokens al contrato para que agentSpendTokens funcione
      await pumaToken.transfer(await pumaToken.getAddress(), ethers.parseEther("10000"));
      
      // Establecer allowance para el agente
      await pumaToken.setAgentAllowance(agent1.address, ethers.parseEther("1000"));
    });

    it("Should allow agent to spend tokens", async function () {
      const amount = ethers.parseEther("500");
      const initialBalance = await pumaToken.balanceOf(user1.address);
      
      await pumaToken.connect(agent1).agentSpendTokens(user1.address, amount);
      
      const finalBalance = await pumaToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance + amount);
    });

    it("Should not allow spending more than allowance", async function () {
      const excessiveAmount = ethers.parseEther("1500");
      
      await expect(
        pumaToken.connect(agent1).agentSpendTokens(user1.address, excessiveAmount)
      ).to.be.revertedWith("Amount exceeds agent allowance");
    });

    it("Should update agent allowance after spending", async function () {
      const amount = ethers.parseEther("500");
      const initialAllowance = await pumaToken.getAgentInfo(agent1.address).then(info => info.tokenAllowance);
      
      await pumaToken.connect(agent1).agentSpendTokens(user1.address, amount);
      
      const finalAllowance = await pumaToken.getAgentInfo(agent1.address).then(info => info.tokenAllowance);
      expect(finalAllowance).to.equal(initialAllowance - amount);
    });

    it("Should allow agent to transfer from own balance", async function () {
      // Transferir tokens al agente
      await pumaToken.transfer(agent1.address, ethers.parseEther("1000"));
      
      const amount = ethers.parseEther("500");
      const initialBalance = await pumaToken.balanceOf(user1.address);
      
      await pumaToken.connect(agent1).agentTransferTokens(user1.address, amount);
      
      const finalBalance = await pumaToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance + amount);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause contract", async function () {
      await pumaToken.emergencyPause();
      expect(await pumaToken.paused()).to.be.true;
    });

    it("Should allow owner to unpause contract", async function () {
      await pumaToken.emergencyPause();
      await pumaToken.emergencyUnpause();
      expect(await pumaToken.paused()).to.be.false;
    });

    it("Should not allow transfers when paused", async function () {
      await pumaToken.emergencyPause();
      
      await expect(
        pumaToken.transfer(user1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should not allow agent operations when paused", async function () {
      await pumaToken.proposeAgent(agent1.address);
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine");
      await pumaToken.confirmAgent(agent1.address);
      await pumaToken.setAgentAllowance(agent1.address, ethers.parseEther("1000"));
      
      await pumaToken.emergencyPause();
      
      await expect(
        pumaToken.connect(agent1).agentSpendTokens(user1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Contract is paused");
    });
  });

  describe("View Functions", function () {
    it("Should return correct token info", async function () {
      const tokenInfo = await pumaToken.getTokenInfo();
      
      expect(tokenInfo.name).to.equal(TOKEN_NAME);
      expect(tokenInfo.symbol).to.equal(TOKEN_SYMBOL);
      expect(tokenInfo.totalSupply).to.equal(INITIAL_SUPPLY_WITH_DECIMALS);
      expect(tokenInfo.decimals).to.equal(18);
      expect(tokenInfo.launchTimestamp).to.be.gt(0);
      expect(tokenInfo.lastConfigurationTime).to.be.gt(0);
    });

    it("Should return correct agent info", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      const agentInfo = await pumaToken.getAgentInfo(agent1.address);
      expect(agentInfo.isProposed).to.be.true;
      expect(agentInfo.isAuthorized).to.be.false;
      expect(agentInfo.authorizationTime).to.be.gt(0);
    });

    it("Should return correct cooldown remaining", async function () {
      const cooldownRemaining = await pumaToken.getConfigCooldownRemaining();
      expect(cooldownRemaining).to.equal(0); // Sin configuración previa
    });

    it("Should return correct confirmation remaining", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      const confirmationRemaining = await pumaToken.getAgentConfirmationRemaining(agent1.address);
      expect(confirmationRemaining).to.be.gt(0);
      expect(confirmationRemaining).to.be.lte(86400); // Máximo 1 día
    });
  });

  describe("Access Control", function () {
    it("Should not allow non-owner to configure AI agents", async function () {
      await expect(
        pumaToken.connect(user1).configureAIAgents(true, true, true, true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow non-owner to propose agent", async function () {
      await expect(
        pumaToken.connect(user1).proposeAgent(agent1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow non-owner to confirm agent", async function () {
      await pumaToken.proposeAgent(agent1.address);
      
      await expect(
        pumaToken.connect(user1).confirmAgent(agent1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow non-owner to revoke agent", async function () {
      await pumaToken.proposeAgent(agent1.address);
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine");
      await pumaToken.confirmAgent(agent1.address);
      
      await expect(
        pumaToken.connect(user1).revokeAgent(agent1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow non-owner to pause contract", async function () {
      await expect(
        pumaToken.connect(user1).emergencyPause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
