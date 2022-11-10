import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types/Ballot";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

describe("Ballot", () => {

    let ballotContract :Ballot;
    let accounts: SignerWithAddress[];

    beforeEach(async () => {
        const ballotFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotFactory.deploy(convertStringArrayToBytes32(PROPOSALS));
        await ballotContract.deployed();
        accounts = await ethers.getSigners();
    });

    describe("when the contract is deployed", async () => {
        it("has the provided proposals", async () => {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
                    PROPOSALS[index]
            )};
        });
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const voteCount = await (await ballotContract.proposals(index)).voteCount;
        expect(voteCount).to.eq(0);
      };
    });

    it("sets the deployer address as chairperson", async function () {
      const chairPerson = await ballotContract.chairperson();
      const deployerAddress = accounts[0].address;
      expect(chairPerson).to.equal(deployerAddress);
    });

    it("sets the voting weight for the chairperson as 1", async function () {
      const chairPersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairPersonVoter.weight).to.equal(1);
    });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      await ballotContract.giveRightToVote(accounts[1].address);
      expect((await ballotContract.voters(accounts[1].address)).weight).to.equal(1);
    });
    it("can not give right to vote for someone that has voted", async function () {
      await ballotContract.giveRightToVote(accounts[1].address);
      await ballotContract.connect(accounts[1]).vote(0);
      expect(ballotContract.giveRightToVote(accounts[1].address)).to.be.revertedWith("Already voted");
    });
    it("can not give right to vote for someone that has already voting rights", async function () {
      await ballotContract.giveRightToVote(accounts[1].address);
      expect(ballotContract.giveRightToVote(accounts[1].address)).to.be.revertedWith("The voter already voted.");
    });
  });
    
});


function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}



//   describe("when the voter interact with the vote function in the contract", function () {
//     // TODO
//     it("should register the vote", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when the voter interact with the delegate function in the contract", function () {
//     // TODO
//     it("should transfer voting power", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
//     // TODO
//     it("should revert", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when the an attacker interact with the vote function in the contract", function () {
//     // TODO
//     it("should revert", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when the an attacker interact with the delegate function in the contract", function () {
//     // TODO
//     it("should revert", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when someone interact with the winningProposal function before any votes are cast", function () {
//     // TODO
//     it("should return 0", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
//     // TODO
//     it("should return 0", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when someone interact with the winnerName function before any votes are cast", function () {
//     // TODO
//     it("should return name of proposal 0", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
//     // TODO
//     it("should return name of proposal 0", async () => {
//       throw Error("Not implemented");
//     });
//   });

//   describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
//     // TODO
//     it("should return the name of the winner proposal", async () => {
//       throw Error("Not implemented");
//     });
//   });
// });