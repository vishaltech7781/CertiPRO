import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Course, Category } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Plus, Trash2, ArrowLeft, BookOpen, Layers, HelpCircle, Code } from 'lucide-react';

export const AdminCourseEditorPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const isNew = !courseId || courseId === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'info' | 'modules' | 'lessons' | 'quiz' | 'coding'>('info');

  // Form states
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [courseType, setCourseType] = useState<'Theory' | 'Coding' | 'Mixed'>('Mixed');
  const [estimatedDuration, setEstimatedDuration] = useState('10 hours');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80');
  const [instructorName, setInstructorName] = useState('CertiPro Faculty');
  const [instructorTitle, setInstructorTitle] = useState('Staff Engineer');
  const [instructorBio, setInstructorBio] = useState('Experienced industry practitioner and curriculum designer.');
  const [skills, setSkills] = useState('TypeScript, Architecture, Testing');
  const [learningObjectives, setLearningObjectives] = useState('Build complete web services\nMaster asynchronous workflows\nDeploy production systems');
  const [isPublished, setIsPublished] = useState(true);

  // Curriculum states
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonYoutubeId, setNewLessonYoutubeId] = useState('');
  const [newLessonModuleId, setNewLessonModuleId] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(15);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch Categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories'),
  });

  // Fetch Course details if editing
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ['admin-course-detail', courseId],
    queryFn: () => api.get(`/admin/courses/${courseId}`),
    enabled: !isNew,
  });

  // Fetch Curriculum if editing
  const { data: curriculumData, refetch: refetchCurriculum } = useQuery({
    queryKey: ['admin-course-curriculum', courseId],
    queryFn: () => api.get(`/courses/${courseId}/curriculum`),
    enabled: !isNew,
  });

  useEffect(() => {
    if (courseData?.data) {
      const c = courseData.data;
      setTitle(c.title || '');
      setShortDescription(c.shortDescription || '');
      setDescription(c.description || '');
      setCategory(c.category || 'Web Development');
      setSkillLevel(c.skillLevel || 'Beginner');
      setCourseType(c.courseType || 'Mixed');
      setEstimatedDuration(c.estimatedDuration || '10 hours');
      setThumbnail(c.thumbnail || '');
      setInstructorName(c.instructor?.name || 'CertiPro Faculty');
      setInstructorTitle(c.instructor?.title || '');
      setInstructorBio(c.instructor?.bio || '');
      setSkills(c.skills?.join(', ') || '');
      setLearningObjectives(c.learningObjectives?.join('\n') || '');
      setIsPublished(c.isPublished ?? true);
    }
  }, [courseData]);

  const categories: Category[] = categoriesData?.data || [];
  const modules = curriculumData?.data?.modules || [];
  const lessons = curriculumData?.data?.lessons || [];

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      title,
      shortDescription,
      description,
      category,
      skillLevel,
      courseType,
      estimatedDuration,
      thumbnail,
      instructor: {
        name: instructorName,
        title: instructorTitle,
        bio: instructorBio,
      },
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      learningObjectives: learningObjectives.split('\n').map((s) => s.trim()).filter(Boolean),
      isPublished,
    };

    try {
      if (isNew) {
        const res = await api.post('/admin/courses', payload);
        queryClient.invalidateQueries({ queryKey: ['admin-courses-list'] });
        navigate(`/admin/courses/${res.data._id}/edit`);
      } else {
        await api.put(`/admin/courses/${courseId}`, payload);
        queryClient.invalidateQueries({ queryKey: ['admin-courses-list'] });
        setFeedback({ type: 'success', message: 'Course details updated successfully.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save course.' });
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || isNew) return;
    try {
      await api.post(`/admin/courses/${courseId}/modules`, {
        title: newModuleTitle.trim(),
        order: modules.length + 1,
      });
      setNewModuleTitle('');
      refetchCurriculum();
    } catch (err: any) {
      alert(err.message || 'Failed to add module');
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim() || !newLessonModuleId || isNew) return;
    try {
      await api.post(`/admin/courses/${courseId}/lessons`, {
        moduleId: newLessonModuleId,
        title: newLessonTitle.trim(),
        youtubeVideoId: newLessonYoutubeId.trim(),
        durationMinutes: Number(newLessonDuration) || 10,
        order: lessons.length + 1,
        isRequired: true,
      });
      setNewLessonTitle('');
      setNewLessonYoutubeId('');
      refetchCurriculum();
    } catch (err: any) {
      alert(err.message || 'Failed to add lesson');
    }
  };

  if (!isNew && courseLoading) return <LoadingSpinner message="Loading course curriculum..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/courses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            {isNew ? 'Create New Course' : `Edit: ${title || 'Course'}`}
          </h1>
        </div>
      </div>

      {feedback && <Alert type={feedback.type}>{feedback.message}</Alert>}

      {/* Tabs */}
      {!isNew && (
        <div className="flex border-b border-surface-200 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'info' ? 'border-ink-900 text-ink-900' : 'border-transparent text-surface-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Basic Details
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`pb-2 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'modules' ? 'border-ink-900 text-ink-900' : 'border-transparent text-surface-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Modules & Lessons ({lessons.length})
          </button>
        </div>
      )}

      {/* Info Form */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveCourse} className="bg-white p-6 rounded-lg border border-surface-200 space-y-4 text-xs shadow-sm">
          <Input label="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <Input
            label="Short Description (for course cards, max 250 characters)"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1.5">
              Full Detailed Syllabus & Overview
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full rounded-md border border-surface-300 p-2.5 text-xs text-ink-900 focus:outline-none focus:border-ink-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-surface-300 p-2 text-xs bg-white text-ink-900"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1.5">Skill Level</label>
              <select
                value={skillLevel}
                onChange={(e: any) => setSkillLevel(e.target.value)}
                className="w-full rounded-md border border-surface-300 p-2 text-xs bg-white text-ink-900"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-1.5">Course Track</label>
              <select
                value={courseType}
                onChange={(e: any) => setCourseType(e.target.value)}
                className="w-full rounded-md border border-surface-300 p-2 text-xs bg-white text-ink-900"
              >
                <option value="Theory">Theory Oriented</option>
                <option value="Coding">Coding Oriented</option>
                <option value="Mixed">Mixed (Theory & Coding)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Estimated Duration (e.g. 12 hours)"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              required
            />
            <Input
              label="Thumbnail Image URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required
            />
          </div>

          {/* Instructor Information */}
          <div className="pt-2 border-t border-surface-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instructor Name"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              required
            />
            <Input
              label="Instructor Title"
              value={instructorTitle}
              onChange={(e) => setInstructorTitle(e.target.value)}
              required
            />
          </div>
          <Input
            label="Instructor Bio"
            value={instructorBio}
            onChange={(e) => setInstructorBio(e.target.value)}
            required
          />

          <Input
            label="Skills Taught (comma-separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-1.5">
              Learning Objectives (one per line)
            </label>
            <textarea
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-surface-300 p-2.5 text-xs text-ink-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pub"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded text-ink-900"
            />
            <label htmlFor="pub" className="text-xs font-semibold text-ink-900 cursor-pointer">
              Publish course immediately in public catalog
            </label>
          </div>

          <div className="pt-4 border-t border-surface-100 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              {isNew ? 'Create Course & Setup Curriculum' : 'Save Course Metadata'}
            </Button>
          </div>
        </form>
      )}

      {/* Modules & Lessons Tab */}
      {!isNew && activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Add Module Box */}
          <div className="bg-white p-5 rounded-lg border border-surface-200 space-y-3 text-xs shadow-sm">
            <h3 className="font-bold text-sm text-ink-900">Add Curriculum Module</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Module title (e.g. Asynchronous Microtask Fundamentals)"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="flex-1 rounded-md border border-surface-300 p-2 text-xs"
              />
              <Button variant="primary" size="sm" onClick={handleAddModule}>
                <Plus className="w-4 h-4 mr-1" /> Add Module
              </Button>
            </div>
          </div>

          {/* Add Lesson Box */}
          <div className="bg-white p-5 rounded-lg border border-surface-200 space-y-3 text-xs shadow-sm">
            <h3 className="font-bold text-sm text-ink-900">Add Lesson to Module</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-surface-400 mb-1">Target Module:</label>
                <select
                  value={newLessonModuleId}
                  onChange={(e) => setNewLessonModuleId(e.target.value)}
                  className="w-full rounded-md border border-surface-300 p-2 text-xs bg-white"
                >
                  <option value="">Select Module</option>
                  {modules.map((m: any) => (
                    <option key={m._id} value={m._id}>
                      Module {m.order}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-surface-400 mb-1">Lesson Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Libuv Event Loop Architecture"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full rounded-md border border-surface-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-surface-400 mb-1">YouTube Video ID:</label>
                <input
                  type="text"
                  placeholder="e.g. PNa9OMajw9w"
                  value={newLessonYoutubeId}
                  onChange={(e) => setNewLessonYoutubeId(e.target.value)}
                  className="w-full rounded-md border border-surface-300 p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-surface-400 mb-1">Duration (minutes):</label>
                <input
                  type="number"
                  value={newLessonDuration}
                  onChange={(e) => setNewLessonDuration(parseInt(e.target.value, 10))}
                  className="w-full rounded-md border border-surface-300 p-2 text-xs"
                />
              </div>
            </div>

            <Button variant="accent" size="sm" onClick={handleAddLesson}>
              <Plus className="w-4 h-4 mr-1" /> Add Lesson
            </Button>
          </div>

          {/* Current Curriculum Overview */}
          <div className="bg-white p-5 rounded-lg border border-surface-200 space-y-4 text-xs shadow-sm">
            <h3 className="font-bold text-sm text-ink-900">Current Course Hierarchy</h3>
            {modules.map((m: any) => {
              const mLessons = lessons.filter(
                (l: any) => l.moduleId === m._id || l.moduleId === m.order?.toString()
              );

              return (
                <div key={m._id} className="border border-surface-200 rounded p-3 space-y-2">
                  <div className="font-bold text-ink-900">
                    Module {m.order}: {m.title}
                  </div>
                  <div className="space-y-1 pl-4">
                    {mLessons.map((l: any) => (
                      <div key={l._id} className="flex items-center justify-between py-1 text-ink-700">
                        <span>{l.title}</span>
                        <span className="font-mono text-surface-400 text-[11px]">
                          YT: {l.youtubeVideoId || 'None'} ({l.durationMinutes}m)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

