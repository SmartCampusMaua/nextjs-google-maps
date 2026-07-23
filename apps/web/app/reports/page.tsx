import { fetchRestaurants } from "@/lib/api";
import PDFGenerator from "./components/PDFGenerator";

export const dynamic = "force-dynamic";

export default async function Page() {
    const sensorsData = (await fetchRestaurants()).data;
    return (
        <div>
            {
              sensorsData.map((data, index) =>
                <PDFGenerator sensor={data.sensor}
                  key={index}
                />
                )
            }
        </div>
    )
}
