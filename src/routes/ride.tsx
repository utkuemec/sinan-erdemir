import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NotFoundPage } from "@/components/NotFoundPage";
import { RideRequestForm } from "@/components/forms/RideRequestForm";
import { candidate } from "@/config/candidate";
import { pageHead } from "@/lib/seo";

const { ride } = candidate;

export const Route = createFileRoute("/ride")({
  head: () =>
    candidate.features.rideRequests
      ? {
          ...pageHead({
            path: "/ride",
            title: ride.pageTitle,
            description: ride.metaDescription,
            ogTitle: ride.ogTitle,
            ogDescription: ride.ogDescription,
          }),
        }
      : {},
  component: RidePage,
});

function RidePage() {
  if (!candidate.features.rideRequests) return <NotFoundPage />;

  return (
    <div className="page">
      <Header variant="solid" />
      <main id="main" tabIndex={-1}>
        <section className="ride-page">
          <div className="container">
            <div className="ride-page__head">
              <p className="t-eyebrow">{ride.eyebrow}</p>
              <h1 className="section-heading">
                {ride.heading}
                <span
                  className="accent-bar"
                  aria-hidden="true"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                />
              </h1>
              <p className="ride-page__lede">{ride.lede}</p>
            </div>

            <div className="ride-page__layout">
              <div className="ride-page__details">
                <article>
                  <CalendarDays size={24} aria-hidden="true" />
                  <div>
                    <h2>Available voting days</h2>
                    <p>Advance voting: October 6–11, 2026</p>
                    <p>Election day: October 26, 2026</p>
                  </div>
                </article>
                <article>
                  <MapPin size={24} aria-hidden="true" />
                  <div>
                    <h2>Where we can take you</h2>
                    <p>{ride.destinationNote}</p>
                  </div>
                </article>
                <article>
                  <Clock size={24} aria-hidden="true" />
                  <div>
                    <h2>What happens next</h2>
                    <p>{ride.responseTime}</p>
                    <p>{ride.availabilityNote}</p>
                  </div>
                </article>
              </div>

              <RideRequestForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
