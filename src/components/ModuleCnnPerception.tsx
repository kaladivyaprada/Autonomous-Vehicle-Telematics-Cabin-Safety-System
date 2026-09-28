import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Eye, Layers, Activity } from 'lucide-react';
import { runCnnPerceptionInference, FeatureMapData, SoftmaxOutput } from '../dl_math/cnnPerceptionModel';

Chart.register(...registerables);

interface ModuleCnnPerceptionProps {
  speedKmh: number;
  isStreaming: boolean;
  onSoftmaxUpdate?: (confidence: number) => void;
}

export const ModuleCnnPerception: React.FC<ModuleCnnPerceptionProps> = ({
  speedKmh,
  isStreaming,
  onSoftmaxUpdate,
}) => {
  const dashcamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [featureMaps, setFeatureMaps] = useState<FeatureMapData[]>([]);
  const [softmaxResult, setSoftmaxResult] = useState<SoftmaxOutput | null>(null);

  // Dashcam simulation state
  const stateRef = useRef({
    frame: 0,
    roadOffset: 0,
    obstacleDist: 45, // meters
    obstacleApproaching: true,
    signType: 'SPEED_100' as 'SPEED_60' | 'SPEED_100' | 'SLOW' | 'NONE',
    signTimer: 0,
  });

  // Setup Chart.js horizontal bar graph
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Clear Lane',
          'Lead Obstacle',
          'Speed Sign',
          'Pedestrian Hazard',
          'Emergency Stop'
        ],
        datasets: [
          {
            label: 'Softmax Confidence (%)',
            data: [85, 10, 2, 2, 1],
            backgroundColor: [
              'rgba(0, 240, 255, 0.75)',
              'rgba(255, 170, 0, 0.75)',
              'rgba(147, 51, 234, 0.75)',
              'rgba(236, 72, 153, 0.75)',
              'rgba(255, 30, 86, 0.85)'
            ],
            borderColor: [
              '#00f0ff',
              '#ffaa00',
              '#9333ea',
              '#ec4899',
              '#ff1e56'
            ],
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#090e18',
            borderColor: '#00f0ff',
            borderWidth: 1,
            titleColor: '#00f0ff',
            bodyColor: '#e2e8f0',
            callbacks: {
              label: (ctx) => ` Confidence: ${(Number(ctx.raw) * 100).toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 1,
            grid: {
              color: 'rgba(0, 240, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (val) => `${Math.round(Number(val) * 100)}%`
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#e2e8f0',
              font: { family: 'Space Grotesk', size: 11, weight: 'bold' }
            }
          }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  // Main rendering loop for dashcam & CNN inference
  useEffect(() => {
    let animId: number;

    const render = () => {
      const s = stateRef.current;
      const canvas = dashcamCanvasRef.current;

      if (isStreaming) {
        s.frame++;
        const deltaSpeed = Math.max(0.5, speedKmh / 25);
        s.roadOffset = (s.roadOffset + deltaSpeed) % 40;

        // Obstacle movement cycle
        if (s.obstacleApproaching) {
          s.obstacleDist -= deltaSpeed * 0.18;
          if (s.obstacleDist < 16) s.obstacleApproaching = false;
        } else {
          s.obstacleDist += deltaSpeed * 0.22;
          if (s.obstacleDist > 85) s.obstacleApproaching = true;
        }

        // Sign timer cycle
        s.signTimer++;
        if (s.signTimer > 280) {
          s.signTimer = 0;
          const signs: ('SPEED_60' | 'SPEED_100' | 'SLOW' | 'NONE')[] = ['SPEED_100', 'SPEED_60', 'SLOW', 'NONE'];
          s.signType = signs[Math.floor(Math.random() * signs.length)];
        }

        // Run genuine CNN inference every 4 frames
        if (s.frame % 4 === 0) {
          const isObstacleClose = s.obstacleDist < 65;
          const { featureMaps: maps, softmaxResult: res } = runCnnPerceptionInference(
            s.frame,
            s.obstacleDist,
            isObstacleClose,
            s.signType
          );

          setFeatureMaps(maps);
          setSoftmaxResult(res);

          if (onSoftmaxUpdate) {
            onSoftmaxUpdate(res.confidence);
          }

          // Update chart dataset
          if (chartInstanceRef.current) {
            chartInstanceRef.current.data.datasets[0].data = res.probabilities;
            chartInstanceRef.current.update('none');
          }
        }
      }

      // Draw Dashcam Canvas
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // Sky / Horizon gradient
          const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
          skyGrad.addColorStop(0, '#030712');
          skyGrad.addColorStop(1, '#0c1b33');
          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, 0, w, h * 0.5);

          // Distant cyber mountains / city horizon
          ctx.fillStyle = '#0f2347';
          ctx.beginPath();
          ctx.moveTo(0, h * 0.5);
          for (let x = 0; x <= w; x += 30) {
            const my = (h * 0.5) - 8 - Math.sin((x + s.frame * 0.2) * 0.05) * 12;
            ctx.lineTo(x, my);
          }
          ctx.lineTo(w, h * 0.5);
          ctx.closePath();
          ctx.fill();

          // Vanishing point horizon
          const horizonY = h * 0.48;

          // Road surface
          const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
          roadGrad.addColorStop(0, '#111827');
          roadGrad.addColorStop(1, '#070b14');
          ctx.fillStyle = roadGrad;
          ctx.fillRect(0, horizonY, w, h - horizonY);

          // Perspective Road Edges
          const vpX = w * 0.5;
          const vpY = horizonY;

          // Road borders (neon cyan edges)
          ctx.strokeStyle = '#00f0ff88';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(vpX - 25, vpY);
          ctx.lineTo(20, h);
          ctx.moveTo(vpX + 25, vpY);
          ctx.lineTo(w - 20, h);
          ctx.stroke();

          // Dashed lane dividers with moving perspective
          ctx.strokeStyle = '#00f0ffbb';
          ctx.lineWidth = 2;
          ctx.setLineDash([12, 14]);
          ctx.lineDashOffset = -s.roadOffset;

          // Left lane divider
          ctx.beginPath();
          ctx.moveTo(vpX - 8, vpY);
          ctx.lineTo(w * 0.33, h);
          ctx.stroke();

          // Right lane divider
          ctx.beginPath();
          ctx.moveTo(vpX + 8, vpY);
          ctx.lineTo(w * 0.67, h);
          ctx.stroke();
          ctx.setLineDash([]); // reset

          // Preceding Vehicle / Obstacle in front
          if (s.obstacleDist < 90) {
            // Perspective sizing based on distance
            const scale = Math.max(0.18, 1 - (s.obstacleDist / 100));
            const carW = 120 * scale;
            const carH = 70 * scale;
            const carX = vpX - (carW / 2) + Math.sin(s.frame * 0.04) * 8;
            const carY = vpY + (h - vpY) * (1 - (s.obstacleDist / 100)) - (carH * 0.7);

            // Car body
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(carX, carY, carW, carH, 6);
            ctx.fill();
            ctx.stroke();

            // Taillights
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;
            ctx.fillRect(carX + carW * 0.1, carY + carH * 0.55, carW * 0.22, carH * 0.25);
            ctx.fillRect(carX + carW * 0.68, carY + carH * 0.55, carW * 0.22, carH * 0.25);
            ctx.shadowBlur = 0; // reset

            // CNN Object Detection Bounding Box Overlay
            const isDanger = s.obstacleDist < 30;
            const boxColor = isDanger ? '#ff1e56' : '#00f0ff';

            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(carX - 4, carY - 6, carW + 8, carH + 12);

            // Corner brackets
            const bracketLen = 8;
            ctx.fillStyle = boxColor;
            ctx.fillRect(carX - 6, carY - 8, bracketLen, 2);
            ctx.fillRect(carX - 6, carY - 8, 2, bracketLen);
            ctx.fillRect(carX + carW + 4 - bracketLen, carY - 8, bracketLen, 2);
            ctx.fillRect(carX + carW + 4, carY - 8, 2, bracketLen);

            // Tag label
            ctx.fillStyle = '#0b1324dd';
            ctx.fillRect(carX - 4, carY - 26, Math.max(130, carW + 8), 18);
            ctx.fillStyle = boxColor;
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.fillText(`OBJ#01 | ${s.obstacleDist.toFixed(1)}m | 97.8%`, carX, carY - 14);
          }

          // Traffic Sign on roadside (right perspective)
          if (s.signType !== 'NONE') {
            const signX = w * 0.85;
            const signY = horizonY + 30;
            ctx.fillStyle = '#334155';
            ctx.fillRect(signX + 10, signY, 4, 60);

            // Circular sign
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(signX + 12, signY - 5, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 10px "JetBrains Mono", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const signText = s.signType === 'SPEED_100' ? '100' : s.signType === 'SPEED_60' ? '60' : 'SLOW';
            ctx.fillText(signText, signX + 12, signY - 5);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
          }

          // HUD Dashcam OSD (On-Screen Display)
          ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`CAM-F01 • 1080p60 • FOV 120°`, 12, 22);
          ctx.fillText(`FPS: 60 • INFERENCE: 7.2ms`, 12, 38);

          // Reticle center
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
          ctx.beginPath();
          ctx.moveTo(w / 2 - 12, h / 2);
          ctx.lineTo(w / 2 + 12, h / 2);
          ctx.moveTo(w / 2, h / 2 - 12);
          ctx.lineTo(w / 2, h / 2 + 12);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speedKmh, isStreaming, onSoftmaxUpdate]);

  return (
    <div className="cyber-card rounded-xl p-4 flex flex-col h-full">
      {/* Module Title */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold tracking-wider font-display uppercase text-white">
              Module 1: Perception Engine
            </h2>
            <div className="text-[10px] text-cyan-400 font-mono">Topic: Convolutional Neural Networks (CNNs)</div>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
          Conv2D + Softmax
        </span>
      </div>

      {/* Dashcam Video Feed Canvas */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-cyan-500/30 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <canvas
          ref={dashcamCanvasRef}
          width={480}
          height={270}
          className="w-full h-full object-cover"
        />
        {/* Live CNN Tag */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>CNN SENSOR FEED</span>
        </div>
      </div>

      {/* Feature Map Activation Grid & Softmax Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
        
        {/* Feature Map Activations */}
        <div className="bg-[#090d16]/90 border border-cyan-500/20 rounded-lg p-2.5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-300 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Feature Map Activations (Conv2D)</span>
            </span>
            <span className="text-[9px] font-mono text-cyan-400">8x8 Slices</span>
          </div>

          <div className="grid grid-cols-2 gap-2 flex-grow">
            {featureMaps.length > 0 ? (
              featureMaps.map((fmap, idx) => (
                <div key={idx} className="bg-black/50 p-1.5 rounded border border-cyan-500/20 flex flex-col items-center">
                  <div className="text-[9px] font-mono text-cyan-300 mb-1 truncate w-full text-center">
                    {fmap.kernelName}
                  </div>
                  {/* Miniature 8x8 Grid Rendering */}
                  <div className="grid grid-cols-8 gap-[1px] w-20 h-20 bg-slate-900 p-0.5 rounded border border-cyan-500/30">
                    {fmap.matrix.flat().map((val, cellIdx) => {
                      const intensity = Math.min(1, Math.max(0, val));
                      // Cyberpunk heatmap color interpolation
                      const bg = `rgba(0, 240, 255, ${Math.max(0.08, intensity)})`;
                      return (
                        <div
                          key={cellIdx}
                          style={{ backgroundColor: bg }}
                          className="w-full h-full rounded-[1px]"
                          title={`Activation: ${val}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-xs text-slate-500 font-mono py-6">
                Initializing Conv2D kernels...
              </div>
            )}
          </div>
        </div>

        {/* Softmax Classification Bar Graph */}
        <div className="bg-[#090d16]/90 border border-cyan-500/20 rounded-lg p-2.5 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-300 flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Softmax Probabilities P(y|x)</span>
            </span>
            {softmaxResult && (
              <span className="text-[9px] font-mono text-emerald-400 truncate max-w-[120px]">
                {softmaxResult.predictedClass} ({(softmaxResult.confidence * 100).toFixed(0)}%)
              </span>
            )}
          </div>

          <div className="relative flex-grow min-h-[140px]">
            <canvas ref={chartCanvasRef} />
          </div>
        </div>

      </div>
    </div>
  );
};
