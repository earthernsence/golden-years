// About page content.

import Image from "next/image";

import aboutImage from "#/about_cc_sl.jpg";
import heering from "#/BIG_CHUCK.jpg";

const AboutPage = () => (
  <>
    <div className="place-self-center max-w-7xl h-full pt-0 pb-12 pl-16 pr-16
                   bg-gy-bg-light dark:bg-gy-bg-dark xs:text-left md:text-justify">
      <div className="text-4xl pb-4 xs:text-center md:text-left">Our Mission</div>
      Our mission is to secure funding to provide essential materials aimed at enhancing the quality of
      life for residents in nursing homes. Through a combination of fundraising events and charitable donations,
      our organization seeks to raise awareness and support individuals affected by Alzheimer&apos;s disease and
      dementia, with a particular focus on those residing in low-income nursing homes who lack necessary resources
      to meet their everyday needs.
      <br />
      <br />
      <div className="text-4xl pb-4 xs:text-center md:text-left">About Us</div>
      <div className="relative flex xs:flex-col md:flex-row justify-between items-center w-full">
        <div className="xs:w-full md:w-1/3 p-4">
          <Image
            src={aboutImage}
            className="w-full border-gray-700 border-2"
            alt="The creators of this website, Carissa Choi and Jace Royer"
            width={785}
            height={842}
          />
          <div className="text-xs text-black dark:text-white opacity-80 pt-2 text-center">
            The creators of this website, Carissa Choi and Sydney Lewis
          </div>
        </div>
        <div className="xs:w-full md:w-2/3">
         My name is Carissa Choi, and my name is Sydney Lewis. We are two seniors at Francis Howell High School
         who conceived a meaningful idea while visiting a college campus. We envisioned a non-profit organization
         designed to help high school students engage with their community and bridge the significant gap between
         the youth and the elderly. Many of our club members, including ourselves, have grandparents who exhibit
         symptoms or have been diagnosed with geriatric illnesses, a medical specialty focused on the unique health
         needs of the elderly.
          <br />
          <br />
         As the co-presidents and founders of Golden Years, a club at FHHS and a non-profit organization,
         our mission is to raise awareness about illnesses that profoundly affect our grandparents.
         Come learn about us more by scrolling down!
        </div>
      </div>
      <br />
      <div className="text-4xl pb-4 xs:text-center md:text-left">About Our Club Sponsor</div>
      <div className="relative flex xs:flex-col md:flex-row justify-between items-center w-full">
        <div className="xs:w-full md:w-2/3">
        Matthew Heering, a teacher at Francis Howell High School but known for teaching AP Biology and
        Computer Science classes. In the late spring of 2024, out of the kindness of his own heart he accepted
        to be the club&apos;s sponsor for Golden Years. He helps us in various ways as giving us advice throughout
        our journey to make Golden Years strong for many years to come.
        </div>
        <div className="xs:w-full md:w-1/3 p-4">
          <Image
            src={heering}
            className="w-full border-gray-700 border-2"
            alt="Club Sponsor Matthew Heering"
            width={320}
            height={320}
          />
          <div className="text-xs text-black dark:text-white opacity-80 pt-2 text-center">
            Our Club Sponsor, Matthew Heering
          </div>
        </div>
      </div>
    </div>
  </>
);

export default AboutPage;

//
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra lacus lacus,
// id fermentum diam pharetra sed. Ut ut cursus mauris. Donec vulputate est vitae ante
// pulvinar dapibus nec sed libero. Vestibulum et dolor ut urna volutpat ornare ac in nisi.
// Duis sed est tellus. Mauris fringilla sapien magna, sit amet laoreet augue consectetur vitae.
// Nam luctus ligula nec viverra feugiat. Aenean scelerisque condimentum magna tristique ultricies.
// Aenean commodo arcu neque. Ut tristique tellus in leo hendrerit pellentesque in eget magna.
//