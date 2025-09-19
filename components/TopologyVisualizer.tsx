import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { NetworkTopology, NetworkDevice, NetworkLink } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { CpuChipIcon, ServerIcon, ComputerDesktopIcon, WifiIcon, CloudIcon, FirewallIcon, PhoneIcon, PrinterIcon, ChevronDoubleRightIcon, NetworkIcon } from './IconComponents';
import { forceSimulation, forceLink, forceManyBody, forceCenter, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

type Position = { x: number; y: number };
type Positions = Record<string, Position>;
type SelectedElement = (NetworkDevice & { elementType: 'device' }) | (NetworkLink & { elementType: 'link' });

// Extend d3-force types to match our data structure
interface NodeDatum extends SimulationNodeDatum, NetworkDevice {}
interface LinkDatum extends SimulationLinkDatum<NodeDatum> {
    source: string; // d3-force expects source/target to be objects after initialization, but we use strings
    target: string;
    label?: string;
    explanation: string;
}

const DeviceIcon: React.FC<{ type: NetworkDevice['type'], className?: string }> = ({ type, className = "w-6 h-6" }) => {
    switch (type) {
        case 'router': return <CpuChipIcon className={className} />;
        case 'switch': return <ChevronDoubleRightIcon className={className} />;
        case 'server': return <ServerIcon className={className} />;
        case 'pc': return <ComputerDesktopIcon className={className} />;
        case 'laptop': return <ComputerDesktopIcon className={className} />;
        case 'access_point': return <WifiIcon className={className} />;
        case 'cloud': return <CloudIcon className={className} />;
        case 'firewall': return <FirewallIcon className={className} />;
        case 'phone': return <PhoneIcon className={className} />;
        case 'printer': return <PrinterIcon className={className} />;
        case 'olt':
        case 'ont':
        case 'splitter':
             return <CpuChipIcon className={className} />;
        default:
            return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
}


const TopologyVisualizer: React.FC<{ topology: NetworkTopology }> = ({ topology }) => {
    const [positions, setPositions] = useState<Positions>({});
    const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        updateDimensions();
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (topology.devices.length === 0 || dimensions.width === 0 || dimensions.height === 0) return;

        // Make mutable copies for d3
        const nodes: NodeDatum[] = topology.devices.map(d => ({ ...d }));
        const links: LinkDatum[] = topology.links.map(l => ({ ...l }));

        const simulation = forceSimulation(nodes)
            .force("link", forceLink(links).id((d: any) => d.id).distance(120).strength(0.5))
            .force("charge", forceManyBody().strength(-800))
            .force("center", forceCenter(dimensions.width / 2, dimensions.height / 2))
            .on("tick", () => {
                // On each tick of the simulation, update the positions state
                const newPositions: Positions = {};
                nodes.forEach(node => {
                    // FIX: Use a type assertion as d3 adds x/y properties at runtime.
                    // Also check for null/undefined to handle coordinates being 0.
                    const simNode = node as SimulationNodeDatum;
                    if (simNode.x != null && simNode.y != null) {
                         newPositions[node.id] = { x: simNode.x, y: simNode.y };
                    }
                });
                setPositions(currentPositions => ({ ...currentPositions, ...newPositions }));
            });

        // Cleanup: stop simulation when component unmounts or dependencies change
        return () => {
            simulation.stop();
        };
    }, [topology, dimensions.width, dimensions.height]);
    
    const linksWithPositions = useMemo(() => {
        return topology.links.map(link => {
            const sourcePos = positions[link.source];
            const targetPos = positions[link.target];
            if (!sourcePos || !targetPos) return null;
            return { ...link, sourcePos, targetPos };
        }).filter(Boolean);
    }, [topology.links, positions]);
    
    return (
        <div className="flex flex-col md:flex-row h-[70vh] gap-4">
            <div ref={containerRef} className="flex-grow w-full md:w-2/3 h-full bg-slate-900/50 rounded-lg relative overflow-hidden border border-slate-700">
                 {Object.keys(positions).length > 0 && (
                    <svg width="100%" height="100%">
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                            </marker>
                        </defs>

                        {/* Render Links */}
                        {linksWithPositions.map((link, i) => (
                            <g key={`${link!.source}-${link!.target}-${i}`} className="cursor-pointer group" onClick={() => setSelectedElement({ ...link, elementType: 'link' })}>
                                <line
                                    x1={link!.sourcePos.x} y1={link!.sourcePos.y}
                                    x2={link!.targetPos.x} y2={link!.targetPos.y}
                                    className={`stroke-slate-600 group-hover:stroke-telnet-yellow transition-all ${selectedElement?.elementType === 'link' && selectedElement.source === link?.source && selectedElement.target === link?.target ? 'stroke-telnet-yellow' : ''}`}
                                    strokeWidth="2"
                                />
                                {link?.label && (
                                    <text
                                        x={(link!.sourcePos.x + link!.targetPos.x) / 2}
                                        y={(link!.sourcePos.y + link!.targetPos.y) / 2}
                                        dy="-5"
                                        className="text-xs fill-slate-400 group-hover:fill-white font-sans"
                                        textAnchor="middle"
                                    >{link.label}</text>
                                )}
                            </g>
                        ))}

                        {/* Render Devices */}
                        {topology.devices.map(device => {
                            const pos = positions[device.id];
                            if (!pos) return null;
                            return (
                                <g key={device.id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer group" onClick={() => setSelectedElement({ ...device, elementType: 'device' })}>
                                    <circle r="20" className={`fill-slate-800 stroke-2 group-hover:stroke-telnet-yellow transition-all ${selectedElement?.elementType === 'device' && selectedElement.id === device.id ? 'stroke-telnet-yellow' : 'stroke-slate-500'}`} />
                                    <foreignObject x="-12" y="-12" width="24" height="24">
                                        <div className="flex items-center justify-center text-telnet-yellow">
                                            <DeviceIcon type={device.type} className="w-6 h-6" />
                                        </div>
                                    </foreignObject>
                                    <text y="35" textAnchor="middle" className="fill-slate-300 group-hover:fill-white font-semibold text-sm font-sans">{device.label}</text>
                                </g>
                            );
                        })}
                    </svg>
                 )}
            </div>
            <div className="w-full md:w-1/3 h-full overflow-y-auto bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                {selectedElement ? (
                    <div>
                        <h3 className="text-xl font-bold text-telnet-yellow mb-2">{selectedElement.elementType === 'device' ? selectedElement.label : (selectedElement.label || `${selectedElement.source} to ${selectedElement.target}`)}</h3>
                        <div className="text-xs uppercase font-bold text-slate-500 mb-4">{selectedElement.elementType === 'device' ? `Dispositivo: ${selectedElement.type}` : 'Conexión'}</div>
                        <MarkdownRenderer content={selectedElement.explanation} courseContext="Network Topology" />
                    </div>
                ) : (
                    <div className="text-center text-slate-500 h-full flex flex-col items-center justify-center">
                         <NetworkIcon className="w-12 h-12 mb-4" />
                        <p className="font-semibold">Diagrama Interactivo</p>
                        <p className="text-sm">Haz clic en un dispositivo o conexión para ver su explicación detallada.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopologyVisualizer;
