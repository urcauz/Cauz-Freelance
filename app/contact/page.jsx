import LeadForm from "app/components/LeadForm";

const bookingBenefits = [
  "Response in under 24 hours.",
  "Clear scope direction before any commitment.",
  "Booking and inquiry flow handled directly on this site."
];

export default function ContactPage() {
  return (
    <div className="page page-contact">
      <section className="section-block section-hero">
        <p className="eyebrow">Booking</p>
        <h1>Start your project here and I will handle next steps personally.</h1>
        <p className="lead">
          Submit your details once. I will reply with either a scoped plan or call confirmation based on your
          request type.
        </p>
      </section>

      <section className="section-block section-reset contact-layout">
        <article className="contact-meta">
          <p className="eyebrow">Before You Submit</p>
          <h3>What to include</h3>
          <ul>
            <li>Your current website or product link</li>
            <li>Business goal and target audience</li>
            <li>Budget range and timeline expectations</li>
            <li>Any references you like visually</li>
          </ul>

          <h3>Why clients prefer this flow</h3>
          {bookingBenefits.map((item) => (
            <p key={item}>{item}</p>
          ))}

          <h3>Availability</h3>
          <p>New projects: 2 slots open for this month.</p>
        </article>

        <LeadForm />
      </section>
    </div>
  );
}
