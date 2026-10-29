import 'package:flutter_test/flutter_test.dart';
import 'package:subakarya_app/main.dart';

void main() {
  testWidgets('SubakaryaApp builds cleanly', (WidgetTester tester) async {
    await tester.pumpWidget(const SubakaryaApp());
    expect(find.byType(SubakaryaApp), findsOneWidget);
  });
}
