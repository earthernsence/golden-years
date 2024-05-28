import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text
} from "@react-email/components";

interface ConfirmSignupEmailProps {
  title: string,
  date: number,
  description: string,
  location: string,
  organiser: {
    name: string,
    email: string,
    username: string
  },
  name: string
}

export const ConfirmSignupEmail: React.FC<Readonly<ConfirmSignupEmailProps>> = ({
  title,
  date,
  description,
  location,
  organiser,
  name
}) => {
  const formattedDate = () => {
    if (!date) return "No date.";
    const dateObject = new Date(date);
    return `${dateObject.toDateString()} at 
    ${dateObject.getHours()}:${dateObject.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <Html lang="en">
      <Head />
      <Preview>Confirming your signup for a Golden Years event</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>
            Thank you {name} for signing up for this Golden Years event.
            <br />
            <Heading style={h1}>Event Information</Heading>
            (All information provided by the Event Organiser, {organiser.name})
            {description}
            <br />
            This will take place on {formattedDate()} at &quot;{location}&quot;.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#000000",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "auto",
  padding: "96px 20px 64px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#aaaaaa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 40px",
};

export default ConfirmSignupEmail;