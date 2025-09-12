# Personal website
This is my personal website template based on Jekyll.

## 💻 Setup
To use it, first install Ruby and all dependencies. On a Linux machine, this can be done using
```shell
sudo apt-get install ruby-full build-essential zlib1g-dev
```

Avoid installing RubyGems packages (called gems) as the root user. Instead, set up a gem installation directory for your user account. The following commands will add environment variables to your `~/.bashrc` file to configure the gem installation path:

```shell
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Finally, install Jekyll, Bundler and all remaining gems:

```shell
gem install jekyll bundler
bundle install # within this folder
```

## 🚀 Hosting the website locally
To make the website available locally (e.g. for development), use:

```shell
bundle exec jekyll serve --incremental --trace
```

## 🌍 Hosting the website publicly
To host this website publicly, simply use push the website to a repo with GitHub pages enabled.