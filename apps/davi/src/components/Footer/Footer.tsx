import { FaGithub } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Wrapper, FooterContainer, Link, Dot, Label } from './Footer.styled';

const VERSION = process.env.REACT_APP_VERSION;
const ENV = process.env.NODE_ENV;
const isProd = ENV === 'production';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <FooterContainer>
        {VERSION && (
          <>
            <Label>
              {VERSION && `v${VERSION}`}
              {ENV && !isProd ? `:${ENV}` : null}
            </Label>
            <Dot />
          </>
        )}
        <Link
          href="https://github.com/DXgovernance/DAVI-monorepo/issues/new?labels=app:Frontend,User%20Submitted"
          target="_blank"
          rel="noopener"
        >
          <Label>{t('reportABug')}</Label>
        </Link>
        <Dot />
        <Link href="https://davi.canny.io/" target="_blank" rel="noopener">
          <Label>{t('suggestAFeature')}</Label>
        </Link>
        <Dot />
        <Link
          href="https://github.com/DXgovernance/DAVI"
          target="_blank"
          rel="noopener"
        >
          <FaGithub size={18} />
        </Link>
      </FooterContainer>
    </Wrapper>
  );
};

export default Footer;
