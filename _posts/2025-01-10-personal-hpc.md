---
layout: post
title: "Create your own budget High Performance Computing cluster with a Raspberry Pi and Google Colab"
excerpt: "Sometimes, your personal computer is just not enough when running big data workflows. At the same time, cloud compute is expensive. If you are struggling with the same issues, I have a solution: Your own HPC cluster based on a Raspberry Pi and Google Colab."
minutes: 4
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
The more interesting part of setup is Google Colab. The main issue with longer Colab sessions for me always is that they disconnect if I close or lock my laptop. This can be circumvented with the Raspberry Pi. If you have a longer session to run, use the browser on your Raspberri Pi (via Raspberry Pi Connect or VNC). The following script in Python can then be used to simulate user input which will keep the session running as long as free compute resources or credits are available.

```python
import random
import time
import pyautogui

def move():
    x: int = random.randint(500,800)
    y: int = random.randint(400,600)
    scroll_1: int = random.randint(100, 300)
    scroll_2: int = random.randint(100, 300)

    pyautogui.moveTo(200, 200, duration = 1)
    pyautogui.scroll(scroll_1) 
    pyautogui.moveTo(200 + x, 200, duration = 1)
    pyautogui.scroll(-scroll_1) 
    pyautogui.moveTo(200 + x, 200 + y, duration = 1)
    pyautogui.click(button='right')
    pyautogui.moveTo(200, 200 + y, duration = 1)
    pyautogui.click(button='left')
    pyautogui.scroll(scroll_2)
    pyautogui.scroll(-scroll_2) 
    
while True:
    move()
    #print('#')
    time.sleep(random.randint(1, 30))
```

You will need to install pyautogui using `pip install pyautogui`. To make the execution easier, you might also append the line `alias keep-running="python /path/to/script.py"` to your `~/.bashrc` file. This way, you can trigger the simulated behaviour by simply entering `keep-running`. Otherwise, just run the script as is.

As mentioned, you can easily sync your Git repository with Colab as described [here](https://www.hanny.dev/blog/2025/git-colab/){:target="blank"}.

## Compute!
That is it! With a few hacky tricks, we can easily set a private budget HPC cluster comprised of (1) a Raspberry Pi and (2) Google Colab. Git and Google Drive allow for easy syncing.

Now go out, train your models and have fun!

Cheers,
David