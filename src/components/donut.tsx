import { arc, pie, scaleOrdinal, select } from "d3";
import { useEffect, useRef, useState } from "react";

const USData = [
  { type: "Poultry", value: 48.9954 },
  { type: "Beef", value: 25.9887 },
  { type: "Pig", value: 22.9373 },
  { type: "Sheep", value: 50.4869 },
  { type: "Goat", value: 32 },
];

const colorScale = scaleOrdinal(
  USData.map((d) => d.type),
  ["#976393", "#685489", "#43457f", "#ff9b83", "lime", "aqua"]
);

const pieArcs = pie()(USData.map((d) => d.value));

function DonutChart() {
  const svgRef = useRef(null);
  const wrapperRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    setDimensions({ height: wrapper.clientHeight, width: wrapper.clientWidth });
    window.removeEventListener("resize", handleResize);
    function handleResize() {
      setDimensions({
        height: wrapper.clientHeight,
        width: wrapper.clientWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    return (): void => window.removeEventListener("resize", handleResize);
  }, [wrapperRef]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const height = wrapper.clientHeight;
    const width = wrapper.clientWidth;
    const svg = select(svgRef.current);

    const arcc = arc()
      .innerRadius(0)
      .innerRadius(width / 6 - height / 3)
      .outerRadius(width / 6 - height / 6);

    if (!wrapper || !USData) return;
    svg.selectAll("g").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "donut-container")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll("path")
      .data(USData)
      .join("path")
      .style("stroke", "white")
      .style("stroke-width", 2)
      .style("fill", (d) => colorScale(d.type))
      .data(pieArcs)
      .attr("d", arcc as unknown as string);
  }, [dimensions]);

  return (
    <div className=" p-20">
      <div ref={wrapperRef} className="w-full h-44 sm:h-80">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default DonutChart;
