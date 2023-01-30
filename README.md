# Fireboom

### Tip
如果打包失败可以尝试增加内存

```sh
export NODE_OPTIONS='--max-old-space-size=7680'
# 7680 = 8 * 1024 - 512
```

## 国际化

```bash
npm run intl:extract
npm run intl:compile
```

## 替换npm库
fireboom-prisma-ast —— https://github.com/woodensail/prisma-ast