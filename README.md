# Personal website
My personal website based on [Parchment](https://github.com/rhl-bthr/parchment), a clean, single column blog template built for jekyll.

## Building locally
* Clone the repository
* Run `bundle install`
* Run `bundle exec jekyll serve --incremental`
* Visit browser at `http://127.0.0.1:4000/`

## Testing locally with Docker
* Make sure Docker Desktop is running, then run `docker compose up --build` from the repository root
* Visit the site at `http://localhost:4000`
* Live reload is enabled: changed files rebuild the site automatically. On Windows bind mounts this takes a few seconds
* Installed gems are cached in a Docker volume, so only the first start is slow
* Stop with `docker compose down` (add `-v` to also delete the gem cache)
* For a one-off production build into `_site`, run `docker compose run --rm site bundle exec jekyll build`

## Usage
* You can customise variables in `_config.yml` and `css/*` files.
* You can add markdown files, say `foo.md` in the root directory
  of the repository. It will then be accessible like
  `your.website.com/foo`.
* To add posts, add your posts in the `_posts` directory. Follow
  the naming convention `%yyyy-%mm-%dd-your-title-here.md`. 
  Subdirectories are included recusively.
* To add a profile picture, use class `profile-picture` around
  the image.
* To change the footer, edit it directly under `_includes/footer.html`