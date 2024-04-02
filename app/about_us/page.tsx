import Image from "next/image";

import aboutImage from "#/about_jr_cc.jpg";

const AboutPage = () => (
  <>
    <div className="place-self-center max-w-7xl pt-0 pb-12 pl-16 pr-16 dark:bg-dark xs:text-left md:text-justify">
      <div className="text-4xl xs:text-center md:text-left">About Us</div>
      <div className="relative flex xs:flex-col md:flex-row justify-between items-center w-full">
        <div className="xs:w-full md:w-1/3 p-4">
          <Image
            src={aboutImage}
            className="w-full border-gray-700 border-2"
            alt="The creators of this website, Carissa Choi and Jace Royer"
            width={4032}
          />
          <div className="text-xs text-black dark:text-white opacity-80 pt-2 text-center">
            The creators of this website, Carissa Choi and Jace Royer
          </div>
        </div>
        <div className="xs:w-full md:w-2/3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra lacus lacus,
          id fermentum diam pharetra sed. Ut ut cursus mauris. Donec vulputate est vitae ante
          pulvinar dapibus nec sed libero. Vestibulum et dolor ut urna volutpat ornare ac in nisi.
          Duis sed est tellus. Mauris fringilla sapien magna, sit amet laoreet augue consectetur vitae.
          Nam luctus ligula nec viverra feugiat. Aenean scelerisque condimentum magna tristique ultricies.
          Aenean commodo arcu neque. Ut tristique tellus in leo hendrerit pellentesque in eget magna.
        </div>
      </div>
      <br />
      Quisque commodo, erat a interdum accumsan, urna tortor ultricies nisi, rhoncus facilisis tellus nibh at orci.
      Nullam in odio justo. Nunc non maximus purus, non ornare ligula. Cras nisi sapien, bibendum vel ornare in,
      rutrum at metus. Fusce sodales arcu mauris, non bibendum lorem aliquet quis. Sed sed dui ut dui pharetra porta.
      Ut fringilla orci purus, quis aliquet dui rutrum non. Praesent quis tellus a neque lobortis malesuada.
    </div>
  </>
);

export default AboutPage;