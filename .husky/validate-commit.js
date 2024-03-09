#!/usr/bin/env node

const commitMessage = process.argv[3]
const branchName = process.argv[2]

const commitRegex = /^\[([^\]]+?)\]_\[([^\]]+?)\]_\[(FIX|ADD|REF|IMP|DOC|TEST)\]_\[([^\]]+?)\](.*)?$/

function validateCommit(commitMessage, branchName) {
	const match = commitMessage.match(commitRegex)
	if (!match) {
		console.error('Failed regex check:', commitMessage)
		console.error('Error: [author]_[branch_name]_[commit_type]_[short_description]optional_long_description')
		process.exit(1)
	}

	const [, author, capturedBranchName, commitType, shortDescription, optionalLongDescription] = match

	if (capturedBranchName !== branchName) {
		console.error(`Error: Branch name mismatch - expected ${branchName}, got ${capturedBranchName}`)
		process.exit(1)
	}
}

validateCommit(commitMessage, branchName)
