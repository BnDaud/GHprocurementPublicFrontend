import React, { useState } from "react";

function Services() {
  const [services, setServices] = useState([
    {
      title: "Sourcing & Supplier Discovery",
      Description:
        "Identify vetted suppliers tailored to your needs, with quality checks and price benchmarking.",
    },
    {
      title: "Contract Negotiation",
      Description:
        "Draft and negotiate contracts to secure favorable terms and mitigate risk.",
    },
    {
      title: "Logistics Coordination",
      Description:
        "Arrange shipping, customs and delivery coordination to your facility — end-to-end support.",
    },
    {
      title: "Inventory & Order Tracking",
      Description:
        "Track shipments and milestones; receive proactive alerts on delays and updates.",
    },
    {
      title: "Inventory & Order Tracking",
      Description:
        "Track shipments and milestones; receive proactive alerts on delays and updates.",
    },
  ]);

  return (
    <div className="md:relative static 0 px-6 md:px-20 pb-20 space-y-4">
      <p className="text-lg font-bold">Services</p>
      <div className="md:flex flex-wrap gap-4 justify-center md:space-y-0 space-y-4">
        {services.map((service) => (
          <div className="md:w-65 md:h-50 w-full min-h-30 bg-white rounded-lg px-6 pt-4 space-y-2 font-sans shadow">
            <p className="text-xl font-bold">{service.title}</p>
            <p> {service.Description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
