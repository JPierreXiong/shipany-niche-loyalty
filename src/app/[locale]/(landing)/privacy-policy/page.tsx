import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    robots: 'index, follow',
  };
}

export default async function PrivacyPolicyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('lastUpdated')}: {t('date')}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('introduction.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('introduction.content')}
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('collection.title')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('collection.merchants.title')}</h3>
              <p className="text-muted-foreground">{t('collection.merchants.content')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('collection.members.title')}</h3>
              <p className="text-muted-foreground">{t('collection.members.content')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('collection.technical.title')}</h3>
              <p className="text-muted-foreground">{t('collection.technical.content')}</p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('usage.title')}</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>{t('usage.point1')}</li>
            <li>{t('usage.point2')}</li>
            <li>{t('usage.point3')}</li>
            <li>{t('usage.point4')}</li>
          </ul>
        </section>

        {/* Data Storage and Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('security.title')}</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>{t('security.infrastructure.title')}:</strong> {t('security.infrastructure.content')}</li>
            <li><strong>{t('security.protection.title')}:</strong> {t('security.protection.content')}</li>
            <li><strong>{t('security.retention.title')}:</strong> {t('security.retention.content')}</li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('thirdParty.title')}</h2>
          <p className="text-muted-foreground mb-4">{t('thirdParty.intro')}</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Vercel:</strong> {t('thirdParty.vercel')}</li>
            <li><strong>Neon:</strong> {t('thirdParty.neon')}</li>
            <li><strong>Creem:</strong> {t('thirdParty.creem')}</li>
            <li><strong>Resend/Twilio:</strong> {t('thirdParty.communication')}</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('rights.title')}</h2>
          <p className="text-muted-foreground mb-4">{t('rights.intro')}</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>{t('rights.access.title')}:</strong> {t('rights.access.content')}</li>
            <li><strong>{t('rights.correction.title')}:</strong> {t('rights.correction.content')}</li>
            <li><strong>{t('rights.optout.title')}:</strong> {t('rights.optout.content')}</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('cookies.title')}</h2>
          <p className="text-muted-foreground">{t('cookies.content')}</p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t('changes.title')}</h2>
          <p className="text-muted-foreground">{t('changes.content')}</p>
        </section>

        {/* Contact */}
        <section className="mb-12 bg-muted/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
          <p className="text-muted-foreground mb-4">{t('contact.intro')}</p>
          <div className="space-y-2">
            <p><strong>{t('contact.email')}:</strong> <a href="mailto:privacy@glow.app" className="text-primary hover:underline">privacy@glow.app</a></p>
            <p><strong>{t('contact.website')}:</strong> <a href="https://glow.app" className="text-primary hover:underline">glow.app</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}











