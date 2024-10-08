import CustomerReview from "@/components/CustomerReview";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import Help1 from "@/components/Help1";
import Help2 from "@/components/Help2";
import Plan from "@/components/Plan";
import request from "@/lib/request";

export default async function Page({ params }) {
  const res = await request(
    `/api/event-templates?populate=plans.services&filters[slug][$eq]=${params.slug}&populate=our_helps.image&populate=image&populate=customer_reviews.profilePic`
  );
  const eventData = res.data[0];

  return (
    <div className="text-white w-4/5 m-auto">
      {/* Heading part */}
      <div className="heading pt-8 pb-5">
        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Let&apos;s Organize{" "}
          <mark class="px-2  text-white bg-blue-900 rounded dark:bg-gray-700">
            {params.slug}
          </mark>{" "}
          . . .
        </h1>
      </div>

      <div className="gallery py-5 flex flex-wrap gap-5 justify-center">
        {eventData?.attributes.image.data.slice(1, 7).map((img, index) => (
          <Gallery
            key={index}
            img={(process.env.NEXT_PUBLIC_API_URL || "") + img.attributes.url}
          />
        ))}
      </div>

      <div className="customerReview mt-8">
        <div className="grid mb-8 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2 bg-white dark:bg-gray-800">
          {eventData?.attributes.customer_reviews.data
            .slice(0, 4)
            .map((data, index) => (
              <CustomerReview
                key={index}
                subject={data.attributes.Subject}
                description={data.attributes.Description}
                profilePic={
                  (process.env.NEXT_PUBLIC_API_URL || "") +
                  data.attributes.profilePic.data.attributes.url
                }
                userName={data.attributes.userName}
              />
            ))}
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Heres how
        </span>{" "}
        we can help you...
      </h1>

      <div className="first ">
        {eventData?.attributes.our_helps.data.map((data, index) =>
          index % 2 === 0 ? (
            <Help1
              key={index}
              title={data.attributes.title}
              description={data.attributes.description}
              img={`${process.env.NEXT_PUBLIC_API_URL || ""}${
                data.attributes.image.data.attributes.url
              }`}
            />
          ) : (
            <Help2
              key={index}
              title={data.attributes.title}
              description={data.attributes.description}
              img={`${process.env.NEXT_PUBLIC_API_URL || ""}${
                data.attributes.image.data.attributes.url
              }`}
            />
          )
        )}
        {/* <Help2 /> */}
      </div>

      <div className="plan mb-10">
        <div className="m-10">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Select your
            </span>{" "}
            Plan
          </h1>
        </div>

        <div className="flex justify-between w-5/6 m-auto overflow-auto">
          {eventData?.attributes.plans.map((plan, index) => (
            <Plan
              key={index}
              price={plan.price}
              premiumServices={
                eventData?.attributes.plans.filter(
                  (plan) => plan.type === "Premium"
                )[0].services.data
              }
              services={plan.services.data}
              type={plan.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
