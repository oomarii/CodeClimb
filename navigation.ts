export type RootStackParamList = {
    Home: undefined;
    Courses: undefined;
    Profile: undefined;
    Lesson: { courseId: string; lessonId: string };
    Quiz: { courseId: string; lessonId: string };
  };
  