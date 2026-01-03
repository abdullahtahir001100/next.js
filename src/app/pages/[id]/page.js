import { connectDB } from '@/lib/db';
import PageContent from '@/lib/models/PageContent';

// Next.js dynamic params se 'id' pick karega
export default async function DynamicPage({ params }) {
  // URL se slug extract karna (e.g., /pages/about ya /Whitelist)
  const { id } = await params; 

  await connectDB();
  
  // URL ID ke mutabik database query
  const data = await PageContent.findOne({ slug: id }).lean();

  // Direct extraction bina kisi cleaning ke, jaisa aapne kaha tha
  const htmlContent = data?.files?.find(f => f.language === 'html')?.value || '';
  const cssContent = data?.files?.find(f => f.language === 'css')?.value || '';
  const jsContent = data?.files?.find(f => f.language === 'javascript')?.value || '';

  if (!data) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>404 | Page Not Found in Viking Cloud</div>;
  }

  return (
    <main>
      {/* DB se aayi CSS directly inject ho rahi hai */}
      {cssContent && <style dangerouslySetInnerHTML={{ __html: cssContent }} />}
      
      <div className="dynamic-page-wrapper">
        <section>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </section>
      </div>

      {/* DB se aaya JS directly inject ho raha hai */}
      {jsContent && <script dangerouslySetInnerHTML={{ __html: jsContent }} />}
    </main>
  );
}