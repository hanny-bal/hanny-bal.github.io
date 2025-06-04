---
layout: post
title: "Using multiple Git accounts in parallel with SSH"
excerpt: "Managing multiple Git accounts on a single machine is often essential. Say you’re juggling personal and work repositories across platforms like GitHub and GitLab. A step-by-step guide to set up and organise accounts seamlessly using SSH."
minutes: 3
seo_title: "How to Use multiple GitHub and GitLab Accounts with SSH on one Machine"
seo_description: "Learn how to manage multiple Git accounts (GitHub and GitLab) on a single computer using SSH keys and configuration files. A step-by-step guide for seamless Git authentication and workflow separation."
---

Picture this: you have repositories on Gitlab for work and another set on GitHub for your personal projects. If you're anything like me, sometimes you will need to access both on the same machine. In principle, this can be achieved fairly easily. However, getting there can be challenging, especially if you're not familiar with the exact working principles of Git and its authentication methods. 

I can't count the numbers of times I had to go through the steps below on a colleague's laptop because nobody else in my working group knew how to set up Git properly with Secure Shell (SSH). Well, this is why we're here today. How to set up multiple Git accounts on the same machine using different SSH keys?

Let’s break it down.


## Step 1: Check your SSH (andd Git) installation
Assuming that Git is already installed (if not, please do so), we'll need to confirm if SSH is installed. On Linux, check for the ~/.ssh directory. If it doesn't exist, you’ll need to install SSH via your package manager (like `apt` for Debian-based distributions or `yum` for Red Hat-based). 

For Windows users, ensure you have OpenSSH installed:
- Open *Apps & Features* from the start menu.
- Navigate to *Manage Optional Features* → *Add a feature*.
- Select *OpenSSH Client* if it isn’t already installed.

## Step 2: Generate SSH keys for each account
With SSH set up, you’re ready to create distinct SSH keys for each account. Open your terminal (or PowerShell on Windows) and run the following commands:

```bash
ssh-keygen -t rsa -C "personal@mail.com" -f ~/.ssh/id_rsa_github
ssh-keygen -t rsa -C "personal@mail.com" -f ~/.ssh/id_rsa_gitlab
```

Each command will create a private-public key pair, generating four files in total:

```bash
~/.ssh/id_rsa_github
~/.ssh/id_rsa_github.pub
~/.ssh/id_rsa_gitlab
~/.ssh/id_rsa_gitlab.pub
```

The `.pub` files are your public keys that you’ll add to your GitHub and GitLab accounts.

## Step 3: Register the SSH Keys with your accounts
To connect your machine securely to GitHub and GitLab, copy each public key and register it with the respective account.
1. Copy the public key by running `cat ~/.ssh/id_rsa_github.pub` or opening the file with a text editor.
2. Log into GitHub or GitLab, navigate to *Settings* → *SSH Keys*, and add the public key.

## Step 4: Add keys to the ssh-agent
Next, let's add each key to the ssh-agent, which handles SSH connections without repeated password prompts. To realise this step, make sure your ssh-agent is running. On Linux, you can run `eval "$(ssh-agent)"` to start it. For Windows, make sure the *OpenSSH Authentication Agent* service is running in the service manager (and start it if it's not).

Now you can add your keys to the ssh-agent by running the following commands:

```bash
ssh-add ~/.ssh/id_rsa_github
ssh-add ~/.ssh/id_rsa_gitlab
```

## Step 5: Configure SSH to differentiate accounts
Now, it's time to set up SSH to use the correct key for each Git service. Create a configuration file at `~/.ssh/config`:

bash
```bash
# Personal GitHub account
Host github.com
   HostName github.com
   User your-username
   IdentityFile ~/.ssh/id_rsa_github 

# Personal GitLab account
Host gitlab.com
   HostName gitlab.com
   User your-username
   IdentityFile ~/.ssh/id_rsa_gitlab
```

This tells SSH to use the key from `id_rsa_github` when connecting to GitHub and `id_rsa_gitlab` for GitLab, avoiding any key conflicts.

## Step 6: Set up Git username and email
Finally, you can configure your Git username and email to match each account. You can either set them up per repository (matching the account with the provider) by running:

```bash
git config user.name "John Doe"
git config user.email johndoe@example.com
```

Or you can also set these variables globally using:

```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

## Done!
With everything in place, you're now ready to handle multiple Git accounts without a hitch. Start cloning, committing and pushing. Git will know exactly which key and credentials to use for each repository, keeping your work and personal projects organised and secure.

Cheers!

David