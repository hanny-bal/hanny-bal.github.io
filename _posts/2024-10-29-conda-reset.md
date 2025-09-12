---
layout: post
# title: "Reset and lock your conda installation without deleting your environments"
excerpt: "You accidentally screwed up your entire conda installation? No need to reinstall all your packages! An easy way to reset your conda installation."
minutes: 2
title: "How to reset a broken conda installation without losing your environments"
description: "Learn how to fix a broken or corrupted conda installation without deleting your environments. This guide shows how to reset conda and lock the base environment to prevent future issues."
---

If you ever found yourself in dependency hell with conda, you might know the frustration. Once an environment is totally shot, it’s usually easier to delete it and create a new one. You then try this new fix you found online and screw up the environment again. Full circle. Repeat until it finally works.

But as time goes by, humans become more careless. It frequently has happened to me that I installed packages in the conda *base* environment instead of the actual environment I just created. Oops. Usually, that’s not a big deal. Sometimes, however, such a small mistake made my entire conda installation stop working.

So, what to do in such a case? Luckily, it’s possible to reset an entire conda installation pretty quickly **while also keeping all existing environments intact**. Additionally, it also makes sense to lock the base environment and make it uneditable to prevent such mistakes in the future.

## Reset your installation

This tutorial will generally assume a Linux installation. On a Windows machine, the procedure will be analogous.

### Step 1: Backup the existing installation

First, rename your conda folder to keep all existing environments.

```bash
mv ~/miniconda3 ~/miniconda3_bck
```

### Step 2: Reinstall conda

Then, reinstall conda as usual

```bash
mkdir -p ~/miniconda3
wget "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh" -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm ~/miniconda3/miniconda.sh
```

### Step 3: Restore your existing environments

Finally, you can restore your existing environments by moving the respective folders. You might just also move some of the environments instead of all.

```bash
mv ~/miniconda3_bck/envs ~/miniconda3
```

You can check if everything works by running `conda info --envs`. If it does, delete the backup folder using `rm -rf ~/miniconda3_bck` .

## Lock your base environment

To avoid future mishappenings, we can now lock the base environment right away.

1. First, run the command `python -c "import setuptools; print(setuptools.__file__)"` . This will return a path that looks something like this: `/home/<user>/miniconda3/lib/python3.12/site-packages/setuptools/init.py` . The part that comes before the setuptools folder (i.e. the parent folder) is the path we want to lock.
2. Run `chmod -w <path-to-lock>` to remove write permissions for this folder. You should now be unable to install any packages to the base environment.
3. In case you still do need install something all of a sudden, you can add the permissions back by running `chmod +w <path-to-lock>` .

## Done!

That’s it. Challenge resolved. You now have a fresh conda installation. On to new challenges!

Cheers!

David