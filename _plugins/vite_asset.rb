require 'json'

module Jekyll
  class ViteAssetTag < Liquid::Tag
    def initialize(tag_name, args, tokens)
      super
      parts = args.strip.split(/\s+/)
      @entry = parts[0]
      @type = parts[1]  # "css" | "js" | nil（都输出）
    end

    def render(context)
      site = context.registers[:site]
      manifest_path = File.join(site.source, 'assets', 'dist', '.vite', 'manifest.json')
      manifest = JSON.parse(File.read(manifest_path))
      entry_data = manifest[@entry] or raise "Vite 入口 '#{@entry}' 不在 manifest 中"

      output = String.new
      baseurl = site.config['baseurl'] || ''

      # CSS（Vite 提取到 entry 的 css 数组中）
      if [nil, 'css'].include?(@type)
        css_files = entry_data['css'] || []
        css_files.each do |f|
          output << %(<link rel="stylesheet" href="#{baseurl}/assets/dist/#{f}">\n)
        end
      end

      # JS
      if [nil, 'js'].include?(@type)
        if entry_data['file']
          output << %(<script src="#{baseurl}/assets/dist/#{entry_data['file']}"></script>)
        end
      end

      output.empty? ? '' : output.strip
    end
  end
end

Liquid::Template.register_tag('vite_asset', Jekyll::ViteAssetTag)
