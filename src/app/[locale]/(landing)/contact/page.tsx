import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Mail, MessageSquare, Users } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

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

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* General Inquiry */}
        <div className="bg-muted/50 rounded-2xl p-8 text-center hover:bg-muted transition-colors">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">{t('general.title')}</h3>
          <p className="text-muted-foreground mb-4">{t('general.description')}</p>
          <a
            href="mailto:hello@glow.app"
            className="text-primary hover:underline font-medium"
          >
            hello@glow.app
          </a>
        </div>

        {/* Technical Support */}
        <div className="bg-muted/50 rounded-2xl p-8 text-center hover:bg-muted transition-colors">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">{t('support.title')}</h3>
          <p className="text-muted-foreground mb-4">{t('support.description')}</p>
          <a
            href="mailto:support@glow.app"
            className="text-primary hover:underline font-medium"
          >
            support@glow.app
          </a>
        </div>

        {/* Collaborations */}
        <div className="bg-muted/50 rounded-2xl p-8 text-center hover:bg-muted transition-colors">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">{t('partnerships.title')}</h3>
          <p className="text-muted-foreground mb-4">{t('partnerships.description')}</p>
          <a
            href="mailto:partners@glow.app"
            className="text-primary hover:underline font-medium"
          >
            partners@glow.app
          </a>
        </div>
      </div>

      {/* Response Time */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-3">{t('response.title')}</h3>
        <p className="text-muted-foreground">
          {t('response.description')}
        </p>
      </div>
    </div>
  );
}


