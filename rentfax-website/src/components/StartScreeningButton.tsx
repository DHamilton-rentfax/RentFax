"use client";

type Props = {
  className?: string;
};

export default function StartScreeningButton({ className }: Props) {
  const handleClick = () => {
    const url = new URL("https://app.rentfax.io/search");
    url.searchParams.set("source", "website");
    url.searchParams.set("intent", "renter_search");

    window.location.href = url.toString();
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ??
        "rounded-xl bg-black px-6 py-3 text-white font-semibold hover:bg-gray-900 transition"
      }
    >
      Start Screening
    </button>
  );
}
