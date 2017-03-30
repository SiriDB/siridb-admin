#!/usr/bin/python3
import os
import subprocess
import argparse

template = '''// +build !debug

package {package}

// {variable} is a byte representation for {fn}
var {variable} = []byte{{{bytes}}}
'''

binfiles = [
    ("./static/css/bootstrap.min.css", "FileBootstrapMinCSS"),
    ("./static/css/font-awesome.min.css", "FileFontAwesomeMinCSS"),
    ("./static/img/siridb-large.png", "FileSiriDBLargePNG"),
    ("./static/img/siridb-small.png", "FileSiriDBSmallPNG"),
    ("./static/fonts/FontAwesome.otf", "FileFontAwesomeOTF"),
    ("./static/fonts/fontawesome-webfont.eot", "FileFontawesomeWebfontEOT"),
    ("./static/fonts/fontawesome-webfont.svg", "FileFontawesomeWebfontSVG"),
    ("./static/fonts/fontawesome-webfont.ttf", "FileFontawesomeWebfontTTF"),
    ("./static/fonts/fontawesome-webfont.woff", "FileFontawesomeWebfontWOFF"),
    ("./static/fonts/fontawesome-webfont.woff2",
        "FileFontawesomeWebfontWOFF2"),
    ("./static/favicon.ico", "FileFaviconICO"),
    ("./src/index.html", "FileIndexHTML"),
    ("./build/bundle.min.js", "FileBundleMinJS"),
    ("./build/layout.min.css", "FileLayoutMinCSS"),
]


def compile_less():
    path = os.path.dirname(__file__)
    subprocess.run([
        'lessc',
        '--clean-css',
        os.path.join(path, 'src', 'layout.less'),
        os.path.join(path, 'build', 'layout.min.css')])

    subprocess.run([
        'lessc',
        os.path.join(path, 'src', 'layout.less'),
        os.path.join(path, 'build', 'layout.css')])


def compile(fn, variable, empty=False):
    if empty:
        data = ''
    else:
        with open(fn, 'rb') as f:
            data = f.read()
    with open('{}.go'.format(variable.lower()), 'w', encoding='utf-8') as f:
        f.write(template.format(
            package='main',
            fn=fn,
            variable=variable,
            bytes=', '.join(str(c) for c in data)
        ))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument(
        '-l', '--less',
        action='store_true',
        help='compile less')

    parser.add_argument(
        '-g', '--go',
        action='store_true',
        help='compile go')

    parser.add_argument(
        '-e', '--go-empty',
        action='store_true',
        help='compile empty go files')

    args = parser.parse_args()

    if args.less:
        print('Compile less...')
        compile_less()
        print('Finished!')
    elif args.go:
        print('Compile go...')
        for bf in binfiles:
            compile(*bf)
        print('Finished!')
    elif args.go_empty:
        print('Compiled empty go files...')
        for bf in binfiles:
            compile(*bf, empty=True)
        print('Finished!')
    else:
        parser.print_usage()

