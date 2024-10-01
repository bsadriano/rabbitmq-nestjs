FROM nginx:1.18.0-alpine
WORKDIR /etc/nginx/templates
COPY conf/default.conf.template /etc/nginx/templates/default.conf.template
COPY conf/proxy_headers.conf /etc/nginx/proxy_headers.conf
