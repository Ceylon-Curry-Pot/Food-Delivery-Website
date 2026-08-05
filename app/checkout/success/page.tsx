import { redirect } from 'next/navigation';

// This page is not used — checkout redirects directly to /tracker/:id
// Keeping the file prevents 404 if someone bookmarks an old URL
export default function SuccessPage() {
  redirect('/menu');
}