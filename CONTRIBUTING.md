# Contributing Guide

Welcome to the team! We are excited to have you contribute to the Decentralized Voting System. Since many of you are learning, this guide will walk you through the process of making your first contribution using GitHub and Pull Requests (PRs).

## The Workflow

We use a standard "Fork and Pull" workflow. Here is the step-by-step process:

### 1. Pick an Issue
- Go to the project root and look at the `issue#X.md` files.
- Choose an issue you want to work on (e.g., `issue#1.md`).
- Let the team know you are working on it!

### 2. Fork the Repository
- Go to the main project page on GitHub.
- Click the **Fork** button in the top-right corner.
- This creates a copy of the project in your own GitHub account.

### 3. Clone Your Fork
- Open your terminal.
- Clone **your** forked repository (replace `your-username` with your actual GitHub username):
  ```bash
  git clone https://github.com/your-username/vote.git
  cd vote
  ```

### 4. Create a Branch
- **Never work on `main` directly!** Always create a new branch for your specific task.
- Name your branch descriptively, like `issue-1-core-structs` or `fix-voting-bug`.
  ```bash
  git checkout -b issue-1-core-structs
  ```





### 5. Make Your Changes
- Open the project in your code editor 
- Implement the changes required by your issue in `sources/vote.move`.
- **Test your code!** Run `sui move build` to make sure it compiles.

### 6. Commit Your Changes
- Once you are happy with your work, stage and commit your changes.
- Write a clear message explaining what you did.
  ```bash
  git add .
  git commit -m "Implement core structs for Issue #1"
  ```

### 7. Push to GitHub
- Push your branch to **your** forked repository:
  ```bash
  git push origin issue-1-core-structs
  ```

### 8. Create a Pull Request (PR)
- Go to the original repository on GitHub.
- You should see a yellow banner saying "Compare & pull request". Click it!
- If you don't see it, go to the **Pull requests** tab and click **New pull request**.
- **Base repository**: The main project repo (`main` branch).
- **Head repository**: Your fork (`issue-1-core-structs` branch).
- Give your PR a title and description. Mention which issue you fixed (e.g., "Fixes Issue #1").
- Click **Create pull request**.

### 9. Code Review
- i will review your code 
- i ll leave comments asking for changes.
- If changes are needed:
    1. Make the changes locally.
    2. Commit them (`git commit -m "Fix review comments"`).
    3. Push again (`git push origin issue-1-core-structs`).
    - The PR will update automatically!
- Once approved, your code will be merged into the main project.

## Tips for Success
- **Small PRs are better**: Try to fix one thing at a time.
- **Ask questions**: If you get stuck, ask in the team chat.
- **Read the error messages**: They usually tell you exactly what's wrong.

Happy coding! 
