interface Props {
    id: string;
  }
  
  const MetadataPanel = ({ id }: Props) => (
    <div className="rounded-2xl border bg-white p-5">
      <h3 className="mb-3 font-semibold text-near-brown">Metadata</h3>
      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>ID</span>
          <span className="font-mono text-[10px] text-gray-700">{id}</span>
        </div>
      </div>
    </div>
  );
  
  export default MetadataPanel;