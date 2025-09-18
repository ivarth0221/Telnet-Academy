

import React from 'react';
import type { MindMapNode } from '../types';
import { ShareIcon } from './IconComponents';

interface MindMapNodeProps {
    node: MindMapNode;
    level: number;
    isLast: boolean;
}

const Node: React.FC<MindMapNodeProps> = ({ node, level, isLast }) => {
    return (
        <div className="relative pl-8">
            <div className="absolute left-2.5 top-0 w-px h-full bg-slate-600"></div>
            {!isLast && <div className="absolute left-2.5 top-0 w-px h-full bg-slate-600"></div>}
            <div className="absolute left-2.5 top-4 w-[22px] h-px bg-slate-600"></div>
            
            <div className="relative flex items-center mb-2">
                 <div className="absolute -left-1.5 top-2.5 w-3 h-3 bg-slate-800 border-2 border-telnet-yellow rounded-full z-10"></div>
                 <div className="ml-4 p-2 bg-slate-700 rounded-md">
                    <p className="font-semibold text-white">{node.concept}</p>
                 </div>
            </div>
            
            {node.children && node.children.length > 0 && (
                <div className="mt-2">
                    {node.children.map((child, index) => (
                        <Node key={index} node={child} level={level + 1} isLast={index === node.children!.length - 1} />
                    ))}
                </div>
            )}
        </div>
    );
};


interface MindMapRendererProps {
  root: MindMapNode;
}

const MindMapRenderer: React.FC<MindMapRendererProps> = ({ root }) => {
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
          <div className="p-2 bg-telnet-yellow/20 rounded-full mr-4">
            <ShareIcon className="w-8 h-8 text-telnet-yellow" />
          </div>
          <h2 className="text-2xl font-bold text-white">{root.concept}</h2>
      </div>
      <div className="mt-4">
          {root.children?.map((child, index) => (
              <Node key={index} node={child} level={1} isLast={index === root.children!.length - 1} />
          ))}
      </div>
    </div>
  );
};

export default MindMapRenderer;