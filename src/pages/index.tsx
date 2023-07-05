import DonutChart from "@/components/donut";
import Line from "@/components/line";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>D3 Tech Talk</title>
      </Head>
      <div className="min-h-screen">
        <div className="flex items-center justify-center"></div>
        <Line />
        <DonutChart />
      </div>
    </>
  );
}
