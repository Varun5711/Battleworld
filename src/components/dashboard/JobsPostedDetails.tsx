type Props = {
  jobs: any[];
};

export default function JobsPostedDetails({ jobs }: Props) {
  return (
    <div className="mt-6 space-y-6">
      <div className="border-b border-emerald-800/50 pb-4">
        <h2 className="text-2xl font-light text-emerald-100 tracking-wide">Active Decrees</h2>
        <p className="text-emerald-400/80 text-sm font-light mt-1">Current recruitment mandates</p>
      </div>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <div 
            key={job._id} 
            className="bg-emerald-950/30 backdrop-blur-sm border border-emerald-800/40 rounded-lg p-6 hover:bg-emerald-950/50 hover:border-emerald-700/60 transition-all duration-200"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-emerald-100 mb-2">{job.title}</h3>
                <div className="w-12 h-px bg-emerald-600/60"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Requirements</span>
                    <p className="text-emerald-200/90 font-light mt-1 leading-relaxed">{job.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Location</span>
                    <p className="text-emerald-200/90 font-light mt-1">{job.location}</p>
                  </div>
                  
                  <div>
                    <span className="text-emerald-500/80 text-sm font-medium uppercase tracking-wide">Issued</span>
                    <p className="text-emerald-300/70 font-light text-sm mt-1">
                      {new Date(job._creationTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-emerald-800/40">
              <div className="flex justify-between items-center">
                <span className="text-emerald-500/70 text-xs font-medium uppercase tracking-wider">
                  Decree #{job._id.slice(-6)}
                </span>
                <div className="px-3 py-1 bg-emerald-900/40 border border-emerald-700/50 rounded text-emerald-400 text-xs font-medium">
                  ACTIVE
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}