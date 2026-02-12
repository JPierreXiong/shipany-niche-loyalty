import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function TestI18nPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('common');

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌍 国际化路由穿透测试</h1>
      <hr />
      <div style={{ marginTop: '1rem' }}>
        <p>
          <strong>当前语种:</strong>{' '}
          <code style={{ background: '#eee', padding: '2px 5px' }}>{locale}</code>
        </p>
        <p>
          <strong>翻译测试:</strong> {t('app_name')}
        </p>
      </div>
      <div style={{ marginTop: '2rem', color: '#666' }}>
        <p>💡 如果你能看到这个页面，说明 Middleware 工作正常</p>
        <p>💡 如果翻译显示正确，说明 JSON 已修复</p>
      </div>
    </div>
  );
}










