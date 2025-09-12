---
layout: post
title: "Build a Budget HPC cluster with a Raspberry Pi and Google Colab"
excerpt: "Your personal computer runs into issues with big data workflows? But cloud compute resources are expensive? Then I have a solution for your problem: Your own HPC cluster based on a Raspberry Pi and Google Colab."
minutes: 3
description: "How to set up a personal high performance computing (HPC) cluster using a Raspberry Pi and Google Colab. Ideal for researchers and hobbyists working with big data and machine learning on a budget."
---

In my dayjob as a researcher, I frequently run large-scale data analysis workflows that involve all kinds of processing steps including the training and application of Large Language Models (LLMs) and Application Programming Interface (API) calls. While there are some compute resources available for researchers, including University-wide and national computing clusters, access to them is not always trivial. Frequently, I find myself running a workflow on my personal computer or Google Colab instead because it requires much less overhead and can be used instantaneously. In addition, I am able to use both for private projects as well.

However, there are several drawbacks to this:
- My personal computer is a **laptop** and I have to keep it open and running to execute lengthy tasks. This requires effort, electricity and I cannot just restart the machine while it is computing.
- Google Colab has quite a strict **disconnection** policy and will cancel a running job if left in idle for a longer time.

Both issues can easily be resolved by using platforms like [Lightning AI](https://lightning.ai/){:target="blank"} (which I personally highly recommend). However, Lightning AI is 2-3 times more expensive compared to Google Colab and easy solutions are boring. So why not come up with a hacky solution for setting up your own budget HPC cluster.

## Prerequistes
For the proposed setup you need:
- A Raspberry Pi with your Operating System (OS) of choice. I use a Raspberry Pi 5 with Raspberry Pi OS.
- A Google Account. Obviously.

The Raspberry Pi can be used for low effort jobs like repeated API calls for scraping or translation. Google Colab, on the other hand, can be utilised for more resource-intensive jobs like model training or inference. The development of these scripts should still happen on your main computer. You can synchronise your projects with Git (see [here](https://www.hanny.dev/blog/2025/git-colab/){:target="blank"} how to use Git in Google Colab).

## Component 1: Raspberry Pi
The Raspberry Pi is the basis of our HPC setup. It acts as a low-cost and energy-efficient computer for low-effort but long-running tasks. Assuming that you have installed a proper OS, I recommend to also install an application for remote administration like [Raspberry Pi Connect](https://www.raspberrypi.com/software/connect/){:target="blank"} or [TightVNC](https://www.tightvnc.com/){:target="blank"}. We need a desktop environment with a webbrowser. SSH is not enough.

To run basic Python notebooks, I use [Miniconda](https://docs.anaconda.com/miniconda/install/){:target="blank"} with [Visual Studio Code](https://code.visualstudio.com/docs/setup/raspberry-pi){:target="blank"}. Files can be synced via Git and data can copied via [SCP](https://medium.com/@letsstartlooping/how-to-use-scp-to-copy-files-over-ssh-7cdd604f7c30) or Google Drive (which is what I use).

## Component 2: Google Colab
The more interesting part of setup is Google Colab. The main issue with longer Colab sessions for me always is that they disconnect if I close or lock my laptop. This can be circumvented with the Raspberry Pi. If you have a longer session to run, use the browser on your Raspberri Pi (via Raspberry Pi Connect or VNC). With this setup, you can use any automation library (e.g. pyautogui) to simulate user input which will keep the Colab session running.

While I generally do recommend Python in combination with pyautogui for automation, this solution unfortunately does not work on the newest Raspberry Pi OS due to Wayland display protocol. Programmatically moving the mouse on Wayland is really cumbersome. One alternative I found is to install wtype `sudo apt install wtype` and then create a bash script with the following content:

```bash
while true; do
    wtype w -d 2000 a -d 1000 i -d 1500 t
    sleep 30
done
```

Store this script as `simulate-keystrokes.sh` somewhere on your Raspberry Pi and modify it to be executable using `sudo chmod +x simulate-keystrokes.sh`. It will type the word "wait" every 30 seconds with a pause of 1-2 seconds between every letter. If you now need to keep a Google Colab session running, execute the script using `./simulate-keystrokes.sh`, go to an empty cell in the Colab notebook and let the computer fill the cell.

To make things even easier, you might also append the line `alias simulate-keystrokes="bash /path/to/script.sh"` to your `~/.bashrc` file. This way, you can trigger the simulated behaviour by simply entering `simulate-keystrokes`.

As mentioned, you can easily sync your Git repository with Colab as described [here](https://www.hanny.dev/blog/2025/git-colab/){:target="blank"}.

## Compute!
That is it! With a few hacky tricks, we can easily set a private budget HPC cluster comprised of (1) a Raspberry Pi and (2) Google Colab. Git and Google Drive allow for easy syncing.

Now go out, train your models and have fun!

Cheers,
David