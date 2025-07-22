type Props = {
    jobs: any[];
  };
  
  export default function JobsPostedDetails({ jobs }: Props) {
    return (
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Jobs Posted</h2>
        {jobs.map((job) => (
          <div key={job._id} className="border rounded p-4">
            <p><strong>Title:</strong> {job.title}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Date:</strong> {new Date(job._creationTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  }