# Fireboom-web

This is the frontend of `Fireboom` project.

## Development

First, you need to run a `Fireboom-server` instance. For fast development, you can use the following command to start the server:

```bash
curl -fsSL fireboom.io/install | bash -s fb-project -t init-todo
```

This will create a `Fireboom` project with a `Todo` example and listen on `9123` & `9991` ports. Then, you can start the frontend development server:

```bash
git clone https://github.com/fireboomio/fireboom-web.git
pnpm install
pnpm run dev
```

Open `http://localhost:3000` in your browser.

### I18n

To extract and compile i18n messages, run the following commands:

```bash
npm run intl:extract
```

This will extract all the i18n messages from the source code and save them in the `lang/zh-CN.json` file. Then you can copy the default json file to other languages and translate them.

After the translations are done, run the following command to compile the messages:

```bash
npm run intl:compile
```

This will compile the i18n messages and save them in the `public/lang` folder.

## Build

```bash
pnpm run build
# If the script fails, try to increase the memory limit:
NODE_OPTIONS='--max-old-space-size=7680' pnpm run build
# 7680 = 8 * 1024 - 512
```
