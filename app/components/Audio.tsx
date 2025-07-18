"use client"
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import removeMarkdown from "remove-markdown";
import { Spinner } from "./Spinner";
import { useUploadThing } from "../utils/uploadthingfile"; 

interface OverviewAudioProps {
  paperId: string;
}

export default function OverviewAudio({ paperId }: OverviewAudioProps) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [overview, setOverview] = useState("");

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const { startUpload, isUploading } = useUploadThing("audioUploader");


  const fetchAudioAndText = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch overview text from DB
      const paperRes = await axios.get("/api/genrateaudio", { params: { paperId } });
      const overview = paperRes.data.overview;
      const plainText = removeMarkdown(overview);
      //setText(plainText);
      setOverview(plainText);
      localStorage.setItem(`overview-${paperId}`, plainText);

      // 2. Try fetching audio from DB
      const audioRes = await axios.get("/api/getaudio", { params: { paperId } });
      const existingAudioUrl = audioRes.data?.audio;

       if (existingAudioUrl) {
        localStorage.setItem(`audioUrl-${paperId}`, existingAudioUrl);
        setAudioUrl(existingAudioUrl);
      } else {
        // 3. Audio not found — call Murf API
        const data = {
          text: plainText,
          voice_id: "en-US-ronnie",
          style: "Narration",
          multiNativeLocale: "en-IN",
          encodeAsBase64: false,
        };

        const murfRes = await axios.post(
          "https://api.murf.ai/v1/speech/generate",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "api-key": "ap2_d96e5dc8-5c05-4379-a295-560f0b5087b8",
            },
          }
        );

        const murfAudioUrl = murfRes.data.audioFile;

        console.log(murfAudioUrl);

        setAudioUrl(murfAudioUrl);

        const response = await fetch(murfAudioUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const file = new File([blob], `${paperId}-audio.wav`, { 
          type: "audio/wav" 
        });

        console.log("Uploading file:", file);
        console.log("Size:", file.size);
        console.log("Type:", file.type);

         // Step 3: Upload to UploadThing
        console.log("Uploading to UploadThing...");
        const uploadResult = await startUpload([file]);
        
        if (!uploadResult || !uploadResult[0]) {
          throw new Error("Upload failed - no result returned");
        }

        const uploadedUrl = uploadResult[0].ufsUrl;
        console.log("Upload successful:", uploadedUrl);

        setAudioUrl(uploadedUrl);
        
        // Step 4: Save to database
        console.log("Saving to database...");
        const dbResponse = await axios.post("/api/saveaudio", {
          paperId,
          audioUrl: uploadedUrl,
        });
        
        console.log("Audio URL saved to database:", dbResponse.data);
     }
    } catch (error) {
      console.error("Error fetching audio:", error);
    } finally {
      setLoading(false);
    }
  }, [paperId]);


  const jumpAhead = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const jumpBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const changeSpeed = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || !duration) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const seekPercentage = Math.max(0, Math.min(1, clickPosition / progressBarWidth));
    const seekTime = seekPercentage * duration;
    
    audioRef.current.currentTime = seekTime;
  };

  useEffect(() => {
    const cachedUrl = localStorage.getItem(`audioUrl-${paperId}`);
    const cachedOverview = localStorage.getItem(`overview-${paperId}`);

    if (cachedUrl) setAudioUrl(cachedUrl);
    if (cachedOverview) setOverview(cachedOverview);

    if (!cachedUrl || !cachedOverview) {
      fetchAudioAndText().then(() => setAudioLoaded(true));
    } else {
      setAudioLoaded(true);
    }
  }, [paperId, fetchAudioAndText]);


  // Calculate progress percentage with proper bounds checking
  const progressPercentage = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    console.log("Setting up audio event listeners");

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      console.log("Duration changed:", audio.duration);
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleError = () => {
      console.error("Audio error:", audio.error);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Add event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Check if metadata is already loaded
    if (audio.readyState > 0) {
      updateDuration();
    }

    return () => {
      // Clean up event listeners
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]); // Re-run when audioUrl changes


  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex flex-1 h-screen justify-center items-center"><Spinner/></div>
      ) : audioUrl ? (
        <>
        <div className="m-6 mt-6 sm:mt-10 relative z-10 rounded-xl shadow-xl">
          <audio 
              ref={audioRef} 
              src={audioUrl} 
              className="w-full hidden"
              preload="auto"
              onLoadedMetadata={() => {
                const audio = audioRef.current;
                if (audio?.duration && isFinite(audio.duration)) {
                  console.log("Manually setting duration:", audio.duration);
                  setDuration(audio.duration);
                }
              }}
            />
          
          <div className="bg-white border-slate-100 transition-all duration-500 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
            <div className="flex items-center space-x-4">
              <div className="min-w-0 flex-auto font-semibold">
                <h2 className="text-slate-700 dark:text-slate-400 text-2xl leading-6 truncate">
                  Listen to the Paper Overview
                </h2>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <div 
                  ref={progressBarRef}
                  className="bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden h-2 cursor-pointer"
                  onClick={handleProgressBarClick}
                >
                  <div 
                    className="bg-cyan-500 dark:bg-cyan-400 h-full transition-all duration-100" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <div 
                  className="ring-cyan-500 dark:ring-cyan-400 ring-2 absolute top-1/2 -mt-2 w-4 h-4 flex items-center justify-center bg-white rounded-full shadow transition-all duration-100"
                  style={{ 
                    left: `calc(${progressPercentage}% - 8px)`,
                    transform: 'translateY(-50%)'
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full ring-1 ring-inset ring-slate-900/5" />
                </div>
              </div>
              
              <div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
                <div className="text-cyan-500 dark:text-slate-100">
                  {formatTime(currentTime)}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  {formatTime(duration)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200 rounded-b-xl flex items-center">
            <div className="flex-auto flex items-center justify-evenly">
              <button 
                type="button" 
                aria-label="Rewind 10 seconds" 
                onClick={jumpBack}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-500 rounded-full"
              > 
                <svg width="24" height="24" fill="none">
                  <path d="M6.492 16.95c2.861 2.733 7.5 2.733 10.362 0 2.861-2.734 2.861-7.166 0-9.9-2.862-2.733-7.501-2.733-10.362 0A7.096 7.096 0 0 0 5.5 8.226" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 5v3.111c0 .491.398.889.889.889H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <button 
              type="button" 
              className="bg-white text-slate-900 dark:bg-slate-100 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <svg width="30" height="32" fill="currentColor">
                  <rect x="6" y="4" width="4" height="24" rx="2" />
                  <rect x="20" y="4" width="4" height="24" rx="2" />
                </svg>
              ) : (
                <svg width="30" height="32" fill="currentColor">
                  <path d="M6 4l20 12-20 12z" />
                </svg>
              )}
            </button>

            <div className="flex-auto flex items-center justify-evenly">
              <button 
                type="button" 
                aria-label="Skip 10 seconds" 
                onClick={jumpAhead}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-500 rounded-full"
              >
                <svg width="24" height="24" fill="none">
                  <path d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 5v3.111c0 .491-.398.889-.889.889H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <select
                onChange={(e) => changeSpeed(Number(e.target.value))}
                className="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 dark:text-slate-100 dark:ring-0 dark:bg-slate-500"
                defaultValue="1"
              >
                <option value="0.75">0.75x</option>
                <option value="1">1x (normal)</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>
        </div>
        {overview && (
            <div className="m-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Transcript</h3>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {overview}
              </p>
            </div>
        )}
        </>
      ) : (
        <div>No audio available</div>
      )}
    </div>
  );
}



//56884b7f29831b4056f47ecd7c30ccf558194167


// const data = {
//           text: plainText,
//           voice_id: "en-US-ronnie",
//           style: "Narration",
//           multiNativeLocale: "en-IN",
//           encodeAsBase64: false,
//         };

//         const murfRes = await axios.post(
//           "https://api.murf.ai/v1/speech/generate",
//           data,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//               "api-key": "ap2_d96e5dc8-5c05-4379-a295-560f0b5087b8",
//             },
//           }
//         );