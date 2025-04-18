export type RootStackParamList = {
  Home: undefined;
  Courses: undefined;
  CourseDetail: { courseId: string };
  Lesson: { courseId: string; lessonId: string };
  Quiz:   { courseId: string; lessonId: string };
  Profile: undefined;
};
