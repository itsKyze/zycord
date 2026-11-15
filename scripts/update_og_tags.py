#!/usr/bin/env python3
"""
Inject Discord-style Open Graph tags, Twitter Cards, theme-color, and SEO meta
across all public landing pages in public/.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

pages = {
    'public/index.html': {
        'title': "Zycord — Group Chat That's All Fun & Games",
        'og_title': "Zycord - Group Chat That's All Fun & Games",
        'desc': "Zycord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.",
        'url': '/',
    },
    'public/nitro/index.html': {
        'title': 'Zycord Nitro — Unlock a World of Perks',
        'og_title': 'Nitro Benefits and Features | Zycord',
        'desc': 'Enhance your Zycord experience with Nitro — get custom emojis, animated avatars, larger file uploads, HD screensharing, and more.',
        'url': '/nitro',
    },
    'public/download/index.html': {
        'title': 'Download Zycord — Desktop, Web & PWA',
        'og_title': 'Download Zycord | Zycord',
        'desc': 'Download the best app to communicate over video, voice, or text. Available for Windows Desktop, macOS, Linux, and modern Web & PWA browsers.',
        'url': '/download',
    },
    'public/discover/index.html': {
        'title': 'Discover Public Communities & Servers | Zycord',
        'og_title': 'Discover Communities | Zycord',
        'desc': 'Explore and join vibrant communities for gaming, anime, music, education, and tech on Zycord.',
        'url': '/discover',
    },
    'public/quests/index.html': {
        'title': 'Zycord Quests — Play & Earn Rewards',
        'og_title': 'Zycord Quests | Zycord',
        'desc': 'Earn rewards and exclusive perks for playing your favorite games with friends on Zycord.',
        'url': '/quests',
    },
    'public/safety/index.html': {
        'title': 'Zycord Safety Center | Zycord',
        'og_title': 'Zycord Safety Center | Zycord',
        'desc': 'Zycord is the place to build community and talk with friends. Explore our Safety Center to learn about staying safe and our best practices.',
        'url': '/safety',
    },
    'public/careers/index.html': {
        'title': 'Jobs at Zycord | Work with Us',
        'og_title': 'Jobs at Zycord | Zycord',
        'desc': 'Zycord is looking for passionate people to help build the future of communication. Explore open roles and join our team.',
        'url': '/careers',
    },
    'public/developers/index.html': {
        'title': 'Zycord Developer Portal | Build with Zycord',
        'og_title': 'Zycord Developer Portal | Zycord',
        'desc': 'Build bots, apps, integrations, and games for communities with the Zycord Developer Platform and APIs.',
        'url': '/developers',
    },
    'public/developers/hub.html': {
        'title': 'Zycord Developer Portal | Build with Zycord',
        'og_title': 'Zycord Developer Portal | Zycord',
        'desc': 'Build bots, apps, integrations, and games for communities with the Zycord Developer Platform and APIs.',
        'url': '/developers',
    },
    'public/support/index.html': {
        'title': 'Zycord Support & Help Center',
        'og_title': 'Zycord Support | Help Center',
        'desc': 'Need help with Zycord? Find answers, explore tutorials, or get in touch with our team.',
        'url': '/support',
    },
    'public/status/index.html': {
        'title': 'Zycord Status — System Uptime & Incidents',
        'og_title': 'Zycord Status',
        'desc': 'Real-time operational status and uptime monitoring for Zycord services, API, Voice, Gateway, and Media.',
        'url': '/status',
    },
    'public/blog/index.html': {
        'title': 'Zycord Blog — News, Product Updates & Stories',
        'og_title': 'Zycord Blog',
        'desc': 'The official Zycord blog. Read about the latest product updates, new features, community stories, and engineering deep dives.',
        'url': '/blog',
    },
    'public/legal.html': {
        'title': 'Zycord Terms of Service & Privacy Policy',
        'og_title': 'Zycord Legal Terms & Privacy Policy',
        'desc': 'Review the Terms of Service, Privacy Policy, and Community Guidelines for Zycord.',
        'url': '/legal',
    },
    'public/verify.html': {
        'title': 'Verify Your Account | Zycord',
        'og_title': 'Verify Your Account | Zycord',
        'desc': 'Verify your email address or account on Zycord to access all community features.',
        'url': '/verify',
    },
}

def update_file(rel_path, meta):
    file_path = os.path.join(ROOT, rel_path)
    if not os.path.exists(file_path):
        print('Skipping (not found):', rel_path)
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    og_block = f'''	<title>{meta['title']}</title>
	<meta name="description" content="{meta['desc']}" />

	<!-- Open Graph / Discord / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Zycord" />
	<meta property="og:title" content="{meta['og_title']}" />
	<meta property="og:description" content="{meta['desc']}" />
	<meta property="og:image" content="/site/og-image.jpg" />
	<meta property="og:image:secure_url" content="/site/og-image.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{meta['og_title']}" />
	<meta property="og:url" content="{meta['url']}" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@zycord" />
	<meta name="twitter:title" content="{meta['og_title']}" />
	<meta name="twitter:description" content="{meta['desc']}" />
	<meta name="twitter:image" content="/site/og-image.jpg" />

	<!-- Mobile & Theme -->
	<meta name="theme-color" content="#5865F2" />
	<meta name="apple-mobile-web-app-title" content="Zycord" />
	<meta name="application-name" content="Zycord" />'''

    # Clean existing title, description, and meta tags
    content = re.sub(r'[ \t]*<title>.*?</title>\r?\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'[ \t]*<meta name="description"[^>]*>\r?\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'[ \t]*<meta property="og:[^"]*"[^>]*>\r?\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'[ \t]*<meta name="twitter:[^"]*"[^>]*>\r?\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'[ \t]*<meta name="theme-color"[^>]*>\r?\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'[ \t]*<meta name="apple-mobile-web-app-title"[^>]*>\r?\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'[ \t]*<meta name="application-name"[^>]*>\r?\n?', '', content, flags=re.DOTALL)

    # Insert after viewport
    m = re.search(r'(<meta name="viewport"[^>]*>)', content)
    if m:
        content = content[:m.end()] + '\n' + og_block + content[m.end():]
    else:
        content = re.sub(r'(<head[^>]*>)', r'\1\n' + og_block, content, count=1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated:', rel_path)

def main():
    for rel_path, meta in pages.items():
        update_file(rel_path, meta)
    print("All pages successfully updated!")

if __name__ == '__main__':
    main()
