FROM ruby:3.3-slim

# Build dependencies for gems with native extensions (sass-embedded etc.)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends build-essential git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Keep gems outside /site so the site directory can be bind-mounted over
ENV BUNDLE_PATH=/bundle

WORKDIR /site

# Install gems first so this layer is cached unless the Gemfile changes
COPY Gemfile Gemfile.lock ./
RUN bundle install && rm -rf /bundle/cache

COPY . .

EXPOSE 4000 35729

CMD ["bundle", "exec", "jekyll", "serve", "--livereload", "--force_polling"]
