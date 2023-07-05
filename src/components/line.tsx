import {
  axisBottom,
  axisLeft,
  curveCardinal,
  line,
  scaleLinear,
  select,
} from "d3";
import { useEffect, useRef, useState } from "react";

function Line() {
  const [data, setData] = useState([0, 25, 30, 45, 60, 20, 65, 0]);
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

  // will be called initially and on every data change
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const svg = select(svgRef.current);
    if (!wrapper || !data) return;
    svg.selectAll("g").remove();
    svg.selectAll("path").remove();
    svg.selectAll("line").remove();
    svg.selectAll("circle").remove();
    svg.select("#grad").remove();

    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0 + 30, dimensions.width - 30]);

    const maxScale = Math.max(...data);

    const yScale = scaleLinear()
      .domain([0, maxScale])
      .range([dimensions.height - 50, 0 + 50]);

    const xAxis: any = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index: any) => index + 1);

    svg
      .append("g")
      .attr("transform", "translate(0," + (dimensions.height - 50) + ")")
      .call(xAxis);

    const yAxis: any = axisLeft(yScale).ticks(4);

    svg.append("g").attr("transform", "translate(30, 0)").call(yAxis);

    const myLine = line()
      .x((_, index) => xScale(index))
      // @ts-ignore
      .y(yScale)
      .curve(curveCardinal);

    svg
      .append("linearGradient")
      .attr("id", "grad")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", dimensions.height)
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#49B3B3" },
        { offset: "25%", color: "lime" },
        { offset: "50%", color: "pink" },
        { offset: "100%", color: "aqua" },
      ])
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    svg
      .append("path")
      .data([data])
      .join("path")
      .attr("d", (value: any) => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "url(#grad)")
      .attr("stroke-width", "5px");

    data.forEach((point, i) => {
      svg
        .append("g")
        .append("circle")

        .data([data])
        .attr("r", 12)
        .attr("cx", xScale(i))
        .attr("cy", yScale(point))
        .attr("fill", "purple")
        .attr("cursor", "pointer")

        .on("mouseover", () => {
          const oompaLoompa = svg.append("g").attr("class", `grouppy-boi-${i}`);

          oompaLoompa
            .append("rect")
            .attr("class", `tip-${i}`)
            .attr("width", "30px")
            .attr("height", "30px")
            .attr("fill", "#fcfcfc")
            .attr("rx", `8`)
            .attr("x", (d) => xScale(i))
            .attr("y", (d) => yScale(point) - 20 - 20);
          oompaLoompa
            .append("text")
            .attr("font-size", `12px`)
            .attr("font-weight", `600`)
            .attr("class", `tip-${i}`)
            .attr("x", (d) => xScale(i) + 15 / 2)
            .attr("y", (d) => yScale(point) - 20)
            .text(`${point}`);

          svg
            .append("line")
            .attr("class", `line-${i}`)
            .attr("x1", xScale(i))
            .attr("x2", xScale(i))
            .attr("y1", yScale(0))
            .attr("y2", yScale(maxScale) - 40)
            .attr("stroke", "green")
            .attr("stroke-width", "3px")
            .attr("stroke-linecap", "round")
            .attr("stroke-dasharray", "10,10")
            .attr("opacity", "10%");
        })

        .on("mouseleave", () => {
          svg.select(`.grouppy-boi-${i}`).attr("display", "none").remove();
          // svg.select(`.tip-${i}`).attr("display", "none").remove();
          svg.select(`.line-${i}`).attr("display", "none").remove();
        });
    });
  }, [data, dimensions]);

  return (
    <div className=" p-20">
      <div ref={wrapperRef} className="w-full h-44 sm:h-80">
        <svg ref={svgRef}></svg>
      </div>

      <div className="border-2 rounded-md py-12 border-orange-200 w-full flex justify-center">
        <button
          className="bg-pink-200 px-4 py-2 rounded-md mx-2"
          onClick={() =>
            setData(data.map((value) => value + Math.ceil(Math.random() * 15)))
          }
        >
          Update data
        </button>
        <button
          className="bg-pink-200 px-4 py-2 rounded-md mx-2"
          onClick={() => setData(data.filter((value) => value < 35))}
        >
          Filter data
        </button>
      </div>
    </div>
  );
}

export default Line;
