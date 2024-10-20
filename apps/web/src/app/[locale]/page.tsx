import HeroLandingPage from '~assets/images/hero-landing-page.png';
import { HeroBanner } from '~components/View';

export default function Home() {
  return (
    <>
      <HeroBanner
        src={HeroLandingPage}
        title="Wallace Ferreira"
        caption="Software Engineer"
        content="Lorem ipsum odor amet, consectetuer adipiscing elit. Nisl ad dictumst donec consequat sollicitudin mauris. Id inceptos nibh varius; maecenas congue ullamcorper. Senectus massa tellus metus, nullam diam amet fringilla."
        alt="Professional Picture 1 of Wallace Ferreira"
        imageClassName="object-cover"
      />
    </>
  );
}
