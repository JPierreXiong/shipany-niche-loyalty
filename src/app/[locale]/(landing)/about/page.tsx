import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* Story Section */}
      <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">{t('story.title')}</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t('story.paragraph1')}
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t('story.paragraph2')}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {t('story.paragraph3')}
        </p>
      </div>

      {/* Promise Section */}
      <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('promise.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3">{t('promise.performance.title')}</h3>
            <p className="text-muted-foreground">{t('promise.performance.description')}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-3">{t('promise.aesthetic.title')}</h3>
            <p className="text-muted-foreground">{t('promise.aesthetic.description')}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-3">{t('promise.focus.title')}</h3>
            <p className="text-muted-foreground">{t('promise.focus.description')}</p>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('tech.title')}</h2>
        <p className="text-center text-muted-foreground mb-8">
          {t('tech.description')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Next.js', 'Neon', 'Vercel', 'Creem'].map((tech) => (
            <div
              key={tech}
              className="bg-background border rounded-lg p-6 text-center hover:border-primary transition-colors"
            >
              <p className="font-semibold">{tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t('cta.title')}</h2>
        <p className="text-muted-foreground mb-8">{t('cta.description')}</p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {t('cta.button')}
        </a>
      </div>
    </div>
  );
}


