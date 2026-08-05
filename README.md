# Indy+ Wiki

База знаний Indy+, опубликованная на [wiki.indy-plus.com](https://wiki.indy-plus.com/).

## Локальный запуск

```powershell
python -m pip install --requirement requirements.txt
python -m mkdocs serve
```

## Проверка перед отправкой

```powershell
python -m mkdocs build --strict
```

После push в ветку `main` GitHub Actions проверяет сборку и публикует готовый
сайт в ветку `gh-pages`.
